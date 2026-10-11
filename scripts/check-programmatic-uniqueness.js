#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic service x city page uniqueness.
 *
 * Fails (non-zero exit) if any two programmatic pages share an identical
 * meta-description, H1, or intro paragraph.
 *
 * Scans the content sources used by the dynamic route
 * apps/ddeep/app/routes/services.$service.in.$city.tsx:
 *   - apps/ddeep/app/data/cityContent.ts
 *   - apps/ddeep/app/data/servicesContent.tsx
 *
 * Usage: node scripts/check-programmatic-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/data/servicesContent.tsx',
];

function readFirstExisting(paths) {
  for (const rel of paths) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) return { rel, text: fs.readFileSync(abs, 'utf8') };
  }
  return null;
}

/**
 * Very small heuristic extractor: pull string literals assigned to keys we
 * care about. This intentionally avoids a full TS parser so the guardrail
 * stays dependency-free and runs in plain `node`.
 */
function extractField(text, fieldNames) {
  const results = [];
  const names = fieldNames.join('|');
  const re = new RegExp(
    `(?:${names})\\s*[:=]\\s*(?:\n\\s*)?[\`'"]([^\`'"]+)[\`'"]`,
    'g'
  );
  let m;
  while ((m = re.exec(text)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

function findDuplicates(values) {
  const seen = new Map();
  const dupes = [];
  for (const v of values) {
    if (!v) continue;
    const key = v.toLowerCase().replace(/\\s+/g, ' ').trim();
    if (seen.has(key)) {
      dupes.push([seen.get(key), v]);
    } else {
      seen.set(key, v);
    }
  }
  return dupes;
}

function main() {
  const source = readFirstExisting(SOURCES);
  if (!source) {
    console.error(
      '[uniqueness] Could not locate cityContent.ts or servicesContent.tsx under apps/ddeep/app/data/.'
    );
    process.exit(2);
  }

  const metaDescriptions = extractField(source.text, ['metaDescription', 'meta_description', 'description']);
  const h1s = extractField(source.text, ['h1', 'heading', 'title']);
  const intros = extractField(source.text, ['intro', 'introCopy', 'introText', 'lead']);

  const checks = [
    ['meta-description', metaDescriptions],
    ['H1', h1s],
    ['intro copy', intros],
  ];

  let failed = false;
  for (const [label, values] of checks) {
    const dupes = findDuplicates(values);
    if (dupes.length > 0) {
      failed = true;
      console.error(`\n[uniqueness] Duplicate ${label} detected (${dupes.length} pair(s)):`);
      for (const [a, b] of dupes) {
        console.error(`  - "${a}"\n    == "${b}"`);
      }
    }
  }

  if (failed) {
    console.error('\n[uniqueness] FAIL: programmatic pages share identical copy.');
    process.exit(1);
  }

  console.log(
    `[uniqueness] PASS: scanned ${source.rel} — no duplicate meta-description, H1, or intro copy.`
  );
}

main();
