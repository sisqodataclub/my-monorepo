#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic service x city page uniqueness check.
 *
 * Fails (exit 1) if any two programmatic pages share an identical
 * meta-description, H1, or intro copy. Prints the offending pairs.
 *
 * Run: node scripts/check-programmatic-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const CANDIDATE_SOURCES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/data/servicesContent.jsx',
  'apps/ddeep/app/data/servicesContent.js',
];

function findSources() {
  return CANDIDATE_SOURCES
    .map((rel) => path.join(ROOT, rel))
    .filter((abs) => fs.existsSync(abs));
}

/**
 * Very small, dependency-free extractor: pulls out string literals
 * associated with metaDescription / description, h1 / h1Text, and
 * intro / introText keys from TS/TSX/JS source. This is intentionally
 * conservative — it only needs to catch copy-paste duplication across
 * programmatic pages.
 */
function extractFields(sourceText) {
  const fields = [];
  const keyRe = /(metaDescription|meta_description|description|h1|h1Text|headline|intro|introText|introCopy)\s*[:=]\s*(['"`])([\s\S]*?)\2/g;
  let m;
  while ((m = keyRe.exec(sourceText)) !== null) {
    fields.push({ key: m[1], value: m[3].trim() });
  }
  return fields;
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function main() {
  const sources = findSources();
  if (sources.length === 0) {
    console.error(
      'check-programmatic-uniqueness: no cityContent / servicesContent source files found. ' +
        'Searched: ' + CANDIDATE_SOURCES.join(', ')
    );
    process.exit(1);
  }

  const buckets = new Map(); // normalizedValue -> [{file, key, raw}]

  for (const file of sources) {
    const text = fs.readFileSync(file, 'utf8');
    for (const { key, value } of extractFields(text)) {
      if (!value || value.length < 20) continue; // skip trivial strings
      const norm = normalize(value);
      if (!buckets.has(norm)) buckets.set(norm, []);
      buckets.get(norm).push({ file: path.relative(ROOT, file), key, raw: value });
    }
  }

  const duplicates = [];
  for (const [norm, entries] of buckets.entries()) {
    if (entries.length > 1) {
      duplicates.push({ norm, entries });
    }
  }

  if (duplicates.length === 0) {
    console.log(
      'check-programmatic-uniqueness: OK — scanned ' +
        sources.length +
        ' source file(s), no duplicate meta-description / H1 / intro copy found.'
    );
    process.exit(0);
  }

  console.error(
    'check-programmatic-uniqueness: FAIL — found ' +
      duplicates.length +
      ' duplicated copy block(s) across programmatic pages:\n'
  );
  for (const dup of duplicates) {
    console.error('  Duplicate copy (normalized): "' + dup.norm.slice(0, 120) + '"');
    for (const e of dup.entries) {
      console.error('    - ' + e.file + '  [' + e.key + ']');
    }
    console.error('');
  }
  process.exit(1);
}

main();
