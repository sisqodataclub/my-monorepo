#!/usr/bin/env node
/**
 * Programmatic page uniqueness guardrail (Bolton plan, Action 6).
 *
 * Scans the programmatic service x city page content sources and fails if
 * any two pages share an identical meta-description, H1, or intro copy.
 *
 * Run: node scripts/check-programmatic-uniqueness.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

// Candidate locations for the content sources named in the plan.
const CANDIDATE_FILES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/cityContent.tsx',
  'apps/ddeep/app/utils/cityContent.ts',
  'apps/ddeep/app/utils/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
  'apps/ddeep/app/content/servicesContent.ts',
  'apps/ddeep/app/utils/servicesContent.tsx',
  'apps/ddeep/app/utils/servicesContent.ts',
];

function findFiles() {
  const found = [];
  for (const rel of CANDIDATE_FILES) {
    const abs = path.join(REPO_ROOT, rel);
    if (fs.existsSync(abs)) found.push(abs);
  }
  // Fallback: shallow walk of apps/ddeep for any *Content.{ts,tsx} file.
  if (found.length === 0) {
    const roots = [
      path.join(REPO_ROOT, 'apps/ddeep/app'),
      path.join(REPO_ROOT, 'apps/ddeep'),
    ];
    const seen = new Set();
    const walk = (dir, depth) => {
      if (depth > 5) return;
      let entries;
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
      catch { return; }
      for (const e of entries) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, depth + 1);
        else if (/Content\.(ts|tsx)$/.test(e.name) && !seen.has(full)) {
          seen.add(full);
          found.push(full);
        }
      }
    };
    for (const r of roots) walk(r, 0);
  }
  return found;
}

/**
 * Extract page records from a source file. We do a light-touch parse: find
 * object literals that contain a slug/city/service identifier plus any of
 * metaDescription / description / h1 / heading / intro / introCopy.
 * This is intentionally heuristic - it is a guardrail, not a compiler.
 */
function extractRecords(file) {
  const src = fs.readFileSync(file, 'utf8');
  const records = [];

  // Split on likely object boundaries: slug: '...' or key: { ... }
  // We scan for each occurrence of a page key and grab a window of text.
  const keyRe = /(?:^|[\s,{])(?:slug|key|id|path|citySlug|serviceSlug)\s*:\s*['"`]([^'"`]+)['"`]/g;
  let m;
  while ((m = keyRe.exec(src)) !== null) {
    const start = m.index;
    const window = src.slice(start, Math.min(src.length, start + 2000));
    const id = m[1];

    const pick = (re) => {
      const mm = window.match(re);
      return mm ? mm[1].trim() : null;
    };

    const metaDescription = pick(/(?:metaDescription|meta_description|description)\s*:\s*['"`]([^'"`]{20,})['"`]/i);
    const h1 = pick(/(?:h1|heading|title)\s*:\s*['"`]([^'"`]{3,})['"`]/i);
    const intro = pick(/(?:intro|introCopy|intro_copy|lead|blurb)\s*:\s*['"`]([^'"`]{20,})['"`]/i);

    if (metaDescription || h1 || intro) {
      records.push({
        file: path.relative(REPO_ROOT, file),
        id,
        metaDescription,
        h1,
        intro,
      });
    }
  }
  return records;
}

function groupDuplicates(records, field) {
  const map = new Map();
  for (const r of records) {
    const v = r[field];
    if (!v) continue;
    const norm = v.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!map.has(norm)) map.set(norm, []);
    map.get(norm).push(r);
  }
  const dupes = [];
  for (const [value, group] of map.entries()) {
    if (group.length > 1) dupes.push({ value, group });
  }
  return dupes;
}

function main() {
  const files = findFiles();
  if (files.length === 0) {
    console.error('[uniqueness] No programmatic content source files found. Expected cityContent.ts / servicesContent.tsx under apps/ddeep.');
    process.exit(2);
  }

  const records = files.flatMap(extractRecords);
  if (records.length === 0) {
    console.error('[uniqueness] Found source files but extracted 0 page records. Check the extractor or the content shape.');
    process.exit(2);
  }

  const fields = ['metaDescription', 'h1', 'intro'];
  let failed = false;

  for (const field of fields) {
    const dupes = groupDuplicates(records, field);
    for (const d of dupes) {
      failed = true;
      console.error(`\n[uniqueness] Duplicate ${field} across ${d.group.length} pages:`);
      console.error(`  value: "${d.value.slice(0, 120)}${d.value.length > 120 ? '...' : ''}"`);
      for (const r of d.group) {
        console.error(`    - ${r.file} :: ${r.id}`);
      }
    }
  }

  if (failed) {
    console.error('\n[uniqueness] FAIL: programmatic pages share identical meta-description / H1 / intro copy.');
    process.exit(1);
  }

  console.log(`[uniqueness] OK: scanned ${records.length} page records across ${files.length} file(s) - no duplicate meta-description, H1, or intro copy.`);
}

main();
