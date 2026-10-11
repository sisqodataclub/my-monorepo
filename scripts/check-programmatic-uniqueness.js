#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic service x city page uniqueness checker.
 *
 * Scans the programmatic page content sources and FAILS (exit 1) if any two
 * pages share an identical meta-description, H1, or intro copy.
 *
 * Targets (searched under the repo, first match wins per role):
 *   - cityContent.ts / cityContent.tsx / cityContent.js
 *   - servicesContent.tsx / servicesContent.ts / servicesContent.js
 *
 * Usage: node scripts/check-programmatic-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

const CANDIDATE_FILES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/cityContent.js',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
  'apps/ddeep/app/content/servicesContent.ts',
];

function findContentFiles() {
  const found = [];
  for (const rel of CANDIDATE_FILES) {
    const abs = path.join(REPO_ROOT, rel);
    if (fs.existsSync(abs)) found.push(abs);
  }
  if (found.length === 0) {
    // Fallback: shallow walk for any file named cityContent.* or servicesContent.*
    const stack = [REPO_ROOT];
    const skip = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo']);
    while (stack.length) {
      const dir = stack.pop();
      let entries;
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        if (skip.has(e.name)) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (/^(cityContent|servicesContent)\.[cm]?[jt]sx?$/.test(e.name)) found.push(p);
      }
    }
  }
  return found;
}

/**
 * Extract candidate page records from a source file using a light regex pass.
 * We intentionally avoid executing TS/TSX. We look for object-literal-ish
 * blocks keyed by city/service and pull out metaDescription, h1/title, intro.
 */
function extractRecords(filePath, source) {
  const records = [];

  // Normalise line endings.
  const text = source.replace(/\r\n/g, '\n');

  // Find object literals that contain at least one of our target keys.
  // We scan for `{ ... }` blocks that mention metaDescription|h1|intro|title.
  const keyRe = /(metaDescription|meta_description|h1|H1|intro|introCopy|intro_copy|title|heading)\s*:\s*([`'"])/g;
  let m;
  while ((m = keyRe.exec(text)) !== null) {
    // Find the enclosing object start by walking back to the nearest '{' at depth 0.
    let i = m.index;
    let depth = 0;
    let start = -1;
    for (let j = i; j >= 0; j--) {
      const ch = text[j];
      if (ch === '}') depth++;
      else if (ch === '{') {
        if (depth === 0) { start = j; break; }
        depth--;
      }
    }
    if (start < 0) continue;

    // Walk forward to matching '}'.
    depth = 0;
    let end = -1;
    for (let j = start; j < text.length; j++) {
      const ch = text[j];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { end = j; break; }
      }
    }
    if (end < 0) continue;

    const block = text.slice(start, end + 1);

    // Extract a slug/key for reporting.
    const slugMatch =
      block.match(/slug\s*:\s*([`'"])[^`'"]+\1/) ||
      block.match(/citySlug\s*:\s*([`'"])[^`'"]+\1/) ||
      block.match(/serviceSlug\s*:\s*([`'"])[^`'"]+\1/);

    const meta = pick(block, ['metaDescription', 'meta_description']);
    const h1 = pick(block, ['h1', 'H1', 'heading', 'title']);
    const intro = pick(block, ['intro', 'introCopy', 'intro_copy']);

    if (!meta && !h1 && !intro) continue;

    records.push({
      file: path.relative(REPO_ROOT, filePath),
      slug: slugMatch ? slugMatch[0].split(':').slice(1).join(':').trim().replace(/^[`'"]|[`'"]$/g, '') : `@${start}`,
      metaDescription: meta,
      h1,
      intro,
    });

    keyRe.lastIndex = end;
  }

  return records;
}

function pick(block, keys) {
  for (const k of keys) {
    const re = new RegExp(k + '\\s*:\\s*([`\'"])([\\s\\S]*?)\\1');
    const m = block.match(re);
    if (m) return normalise(m[2]);
  }
  return null;
}

function normalise(s) {
  return String(s).replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function main() {
  const files = findContentFiles();
  if (files.length === 0) {
    console.error('[uniqueness] No programmatic content files found. Checked candidates:');
    for (const c of CANDIDATE_FILES) console.error('  - ' + c);
    process.exit(1);
  }

  const records = [];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    for (const r of extractRecords(f, src)) records.push(r);
  }

  if (records.length < 2) {
    console.error(`[uniqueness] Only ${records.length} page record(s) extracted from ${files.length} file(s). Nothing to compare.`);
    process.exit(1);
  }

  const fields = ['metaDescription', 'h1', 'intro'];
  const violations = [];

  for (const field of fields) {
    const buckets = new Map();
    for (const r of records) {
      const v = r[field];
      if (!v || v.length < 8) continue; // ignore trivially-short values
      if (!buckets.has(v)) buckets.set(v, []);
      buckets.get(v).push(r);
    }
    for (const [value, group] of buckets) {
      if (group.length > 1) {
        violations.push({ field, value, group });
      }
    }
  }

  if (violations.length === 0) {
    console.log(`[uniqueness] OK — ${records.length} page records across ${files.length} file(s); no duplicate meta-description, H1, or intro copy.`);
    process.exit(0);
  }

  console.error(`[uniqueness] FAIL — ${violations.length} duplicate group(s) found:`);
  for (const v of violations) {
    console.error('');
    console.error(`  Field: ${v.field}`);
    console.error(`  Value: "${v.value.slice(0, 120)}${v.value.length > 120 ? '…' : ''}"`);
    console.error('  Offending pages:');
    for (const r of v.group) {
      console.error(`    - ${r.file}  [${r.slug}]`);
    }
  }
  console.error('');
  console.error('[uniqueness] Each programmatic service x city page must have a unique meta-description, H1, and intro.');
  process.exit(1);
}

main();
