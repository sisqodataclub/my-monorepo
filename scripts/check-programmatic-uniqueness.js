#!/usr/bin/env node
/**
 * check-programmatic-uniqueness.js
 *
 * Guardrail for the programmatic service x city page set.
 * Fails (exit 1) if any two pages share an identical
 * meta-description, H1, or intro paragraph.
 *
 * Scans:
 *   apps/ddeep/app/data/cityContent.ts
 *   apps/ddeep/app/data/servicesContent.tsx
 *
 * Usage:  node scripts/check-programmatic-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANDIDATE_FILES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/utils/cityContent.ts',
  'apps/ddeep/app/utils/servicesContent.tsx',
];

function findFirstExisting(relPaths) {
  for (const rel of relPaths) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

/**
 * Very small heuristic extractor: pulls string literals assigned to
 * keys named metaDescription / meta_description / description,
 * h1 / title, and intro / introCopy / introText.
 *
 * We intentionally avoid a full TS parser so this script has zero
 * dependencies and runs in CI with plain `node`.
 */
function extractFields(source) {
  const fields = { metaDescription: [], h1: [], intro: [] };

  const keyPatterns = {
    metaDescription: /(?:metaDescription|meta_description|metaDesc)\s*:\s*(['"`])([\s\S]*?)\1/g,
    h1: /(?:h1|heading|headline)\s*:\s*(['"`])([\s\S]*?)\1/g,
    intro: /(?:intro|introCopy|introText|description)\s*:\s*(['"`])([\s\S]*?)\1/g,
  };

  for (const [field, re] of Object.entries(keyPatterns)) {
    let m;
    while ((m = re.exec(source)) !== null) {
      const val = (m[2] || '').trim();
      if (val.length > 0) fields[field].push(val);
    }
  }

  return fields;
}

function findDuplicates(values) {
  const seen = new Map();
  const dupes = [];
  for (const v of values) {
    if (seen.has(v)) {
      dupes.push({ value: v, firstIndex: seen.get(v) });
    } else {
      seen.set(v, values.indexOf(v));
    }
  }
  return dupes;
}

function main() {
  const targets = [];
  for (const rel of CANDIDATE_FILES) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) targets.push({ rel, abs });
  }

  if (targets.length === 0) {
    console.error(
      '[uniqueness] No programmatic content files found. Looked for:\n  ' +
        CANDIDATE_FILES.join('\n  ')
    );
    process.exit(2);
  }

  let failures = 0;

  for (const { rel, abs } of targets) {
    const source = fs.readFileSync(abs, 'utf8');
    const fields = extractFields(source);

    for (const [field, values] of Object.entries(fields)) {
      if (values.length < 2) continue;
      const dupes = findDuplicates(values);
      for (const d of dupes) {
        failures++;
        console.error(
          `[uniqueness] DUPLICATE ${field} in ${rel}:\n` +
            `    value: ${JSON.stringify(d.value).slice(0, 160)}\n` +
            `    first seen at entry index ${d.firstIndex}`
        );
      }
    }
  }

  if (failures > 0) {
    console.error(
      `\n[uniqueness] FAILED: ${failures} duplicate field(s) detected across programmatic pages.`
    );
    process.exit(1);
  }

  console.log('[uniqueness] PASS: no duplicate meta-description, H1, or intro copy detected.');
  process.exit(0);
}

main();
