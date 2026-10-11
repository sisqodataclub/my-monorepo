#!/usr/bin/env node
/*
 * Action 6 guardrail: programmatic service x city uniqueness check.
 *
 * Scans the programmatic page content sources and FAILS (exit 1) if any
 * two service x city pages share an identical:
 *   - meta description
 *   - H1
 *   - intro paragraph
 *
 * Prints the offending pairs so the failure is actionable.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANDIDATE_SOURCES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
];

function findSources() {
  const found = [];
  for (const rel of CANDIDATE_SOURCES) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) found.push({ rel, abs });
  }
  if (found.length === 0) {
    // Fall back to a shallow recursive search under apps/ddeep.
    const base = path.join(ROOT, 'apps/ddeep');
    if (fs.existsSync(base)) {
      const stack = [base];
      while (stack.length) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, entry.name);
          if (entry.isDirectory()) stack.push(p);
          else if (/cityContent\.(ts|tsx)$/.test(entry.name) || /servicesContent\.(ts|tsx)$/.test(entry.name)) {
            found.push({ rel: path.relative(ROOT, p), abs: p });
          }
        }
      }
    }
  }
  return found;
}

function stripQuotes(s) {
  return s.replace(/^[`'"]|[`'"]$/g, '').trim();
}

/*
 * Extract page records from a source file. We deliberately avoid executing
 * the module (it may import TS/React). Instead we parse the source text for
 * repeated object literals that contain metaDescription / h1 / intro fields,
 * keyed by a nearby slug or city identifier.
 */
function extractRecords(rel, text) {
  const records = [];
  // Normalise line endings.
  text = text.replace(/\r\n/g, '\n');

  // Split into candidate object blocks: from a `{` that contains one of our
  // target keys, to the matching `}` (naive brace matching is fine here).
  const keyRe = /(metaDescription|meta_description|description|h1|headline|intro|introCopy|intro_copy)\s*:/g;
  let m;
  const starts = [];
  while ((m = keyRe.exec(text)) !== null) {
    // Walk backwards to the nearest `{`.
    let i = m.index;
    while (i > 0 && text[i] !== '{') i--;
    if (text[i] === '{') starts.push(i);
  }

  const seen = new Set();
  for (const start of starts) {
    if (seen.has(start)) continue;
    seen.add(start);
    // Find matching close brace.
    let depth = 0, end = -1;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) continue;
    const block = text.slice(start, end + 1);

    const pick = (keys) => {
      for (const k of keys) {
        const re = new RegExp(k + "\\s*:\\s*([`'\"])([\\s\\S]*?)\\1");
        const mm = block.match(re);
        if (mm) return mm[2].trim();
      }
      return null;
    };

    const metaDescription = pick(['metaDescription', 'meta_description', 'description']);
    const h1 = pick(['h1', 'headline']);
    const intro = pick(['intro', 'introCopy', 'intro_copy']);

    if (!metaDescription && !h1 && !intro) continue;

    // Try to find an identifier for the record (slug / city / key).
    let id = null;
    const idMatch = block.match(/(?:slug|citySlug|city_slug|city|serviceSlug|service|key|id)\s*:\s*([`'"])([^`'"]+)\1/);
    if (idMatch) id = idMatch[2];
    if (!id) {
      // Look just before the block for a property key assignment.
      const before = text.slice(Math.max(0, start - 200), start);
      const km = before.match(/([A-Za-z0-9_"'-]+)\s*:\s*\{\s*$/);
      if (km) id = km[1];
    }
    if (!id) id = `${rel}:${start}`;

    records.push({ id, metaDescription, h1, intro });
  }
  return records;
}

function main() {
  const sources = findSources();
  if (sources.length === 0) {
    console.error('[uniqueness] No programmatic content sources found. Expected cityContent.ts / servicesContent.tsx under apps/ddeep.');
    process.exit(1);
  }

  const all = [];
  for (const { rel, abs } of sources) {
    const text = fs.readFileSync(abs, 'utf8');
    const recs = extractRecords(rel, text);
    for (const r of recs) all.push({ ...r, source: rel });
  }

  if (all.length === 0) {
    console.error('[uniqueness] Parsed 0 programmatic page records from sources: ' + sources.map(s => s.rel).join(', '));
    process.exit(1);
  }

  const fields = ['metaDescription', 'h1', 'intro'];
  const failures = [];

  for (const field of fields) {
    const byValue = new Map();
    for (const rec of all) {
      const v = rec[field];
      if (!v) continue;
      const key = v.replace(/\s+/g, ' ').trim().toLowerCase();
      if (!key) continue;
      if (!byValue.has(key)) byValue.set(key, []);
      byValue.get(key).push(rec);
    }
    for (const [value, recs] of byValue.entries()) {
      if (recs.length > 1) {
        failures.push({ field, value, recs });
      }
    }
  }

  if (failures.length === 0) {
    console.log(`[uniqueness] OK — ${all.length} programmatic page records scanned, no duplicate meta-description / H1 / intro copy.`);
    process.exit(0);
  }

  console.error(`[uniqueness] FAIL — ${failures.length} duplicate field group(s) detected across ${all.length} programmatic page records.\n`);
  for (const f of failures) {
    console.error(`  Field: ${f.field}`);
    console.error(`  Duplicate value: ${JSON.stringify(f.value.slice(0, 160))}${f.value.length > 160 ? '...' : ''}`);
    console.error(`  Offending pages (${f.recs.length}):`);
    for (const r of f.recs) {
      console.error(`    - ${r.source} :: ${r.id}`);
    }
    console.error('');
  }
  console.error('[uniqueness] Every programmatic service x city page must have a unique meta description, H1, and intro copy.');
  process.exit(1);
}

main();
