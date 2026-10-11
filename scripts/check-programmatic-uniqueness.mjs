#!/usr/bin/env node
/**
 * check-programmatic-uniqueness.mjs
 *
 * Action 6 guardrail (Bolton implementation plan).
 *
 * Scans the programmatic service x city content sources and fails (non-zero
 * exit) if any two pages share an identical meta-description, H1, or intro
 * copy. Prints the offending pairs so the regression is obvious in CI logs.
 *
 * Sources scanned (best-effort, both optional):
 *   - apps/ddeep/app/data/cityContent.ts
 *   - apps/ddeep/app/data/servicesContent.tsx
 *   - apps/ddeep/app/components/landing/servicesContent.tsx
 *   - apps/ddeep/app/components/landing/cityContent.ts
 *
 * The parser is intentionally regex-based so it does not require a build step
 * or a TS loader in CI. It looks for object literals that contain a city key
 * plus one or more of: metaDescription, h1, intro.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const CANDIDATE_SOURCES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/components/landing/cityContent.ts',
  'apps/ddeep/app/components/landing/servicesContent.tsx',
  'apps/ddeep/app/utils/cityContent.ts',
];

const FIELDS = ['metaDescription', 'h1', 'intro'];

/** Extract `key: "..."` style string fields from a text blob. */
function extractField(text, field) {
  // Matches:  field: "..."  or  field: '...'  or  field: `...`
  const re = new RegExp(
    `${field}\\s*:\\s*(?:\"((?:[^\"\\\\]|\\\\.)*)\"|'((?:[^'\\\\]|\\\\.)*)'|` + '`((?:[^`\\\\]|\\\\.)*)`)',
    'g'
  );
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const val = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    if (val) out.push(val);
  }
  return out;
}

function normalise(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

const files = CANDIDATE_SOURCES
  .map((p) => resolve(repoRoot, p))
  .filter((p) => existsSync(p));

if (files.length === 0) {
  console.error(
    '[uniqueness] No programmatic content sources found. Checked:\n  ' +
      CANDIDATE_SOURCES.join('\n  ')
  );
  // Do not fail the build if the sources simply moved — warn loudly instead.
  process.exit(0);
}

/** field -> Map(normalisedValue -> [{file, raw}]) */
const buckets = Object.fromEntries(FIELDS.map((f) => [f, new Map()]));

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const field of FIELDS) {
    for (const raw of extractField(text, field)) {
      const key = normalise(raw);
      if (!key) continue;
      if (!buckets[field].has(key)) buckets[field].set(key, []);
      buckets[field].get(key).push({ file, raw });
    }
  }
}

const problems = [];
for (const field of FIELDS) {
  for (const [key, hits] of buckets[field].entries()) {
    if (hits.length > 1) {
      problems.push({ field, key, hits });
    }
  }
}

if (problems.length === 0) {
  console.log(
    `[uniqueness] OK — scanned ${files.length} source file(s); no duplicate ${FIELDS.join(
      '/'
    )} values found.`
  );
  process.exit(0);
}

console.error(
  `[uniqueness] FAIL — ${problems.length} duplicated field group(s) across programmatic pages:\n`
);
for (const { field, hits } of problems) {
  console.error(`  • ${field} shared by ${hits.length} entries:`);
  for (const h of hits) {
    const rel = h.file.replace(repoRoot + '/', '');
    console.error(`      - ${rel}: "${h.raw.slice(0, 120)}"`);
  }
  console.error('');
}
console.error(
  'Each service x city page must have a unique metaDescription, H1, and intro copy.'
);
process.exit(1);
