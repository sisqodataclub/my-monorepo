#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic service x city page uniqueness checker.
 *
 * Fails (non-zero exit) if any two programmatic pages share an identical
 * meta description, H1, or intro copy.
 *
 * Run: node scripts/check-programmatic-uniqueness.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const CANDIDATE_FILES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
];

function findExisting() {
  return CANDIDATE_FILES
    .map((p) => path.join(repoRoot, p))
    .filter((p) => fs.existsSync(p));
}

function extractStringField(src, field) {
  // Very small regex-based extractor: captures `field: "..."` or `field: '...'`
  // and `field: `...`` template literals (single-line only).
  const re = new RegExp(
    field + '\\s*:\\s*(?:"([^"]*)"|\'([^\']*)\'|`([^`]*)`)',
    'g'
  );
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push(m[1] ?? m[2] ?? m[3] ?? '');
  }
  return out;
}

function normalize(s) {
  return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

const files = findExisting();
if (files.length === 0) {
  console.warn(
    '[uniqueness] No cityContent/servicesContent source files found in expected locations; skipping check.'
  );
  process.exit(0);
}

const fields = ['metaDescription', 'description', 'h1', 'title', 'intro', 'introCopy'];
const seen = new Map(); // normalizedValue -> {field, file, index}
const duplicates = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const field of fields) {
    const values = extractStringField(src, field);
    values.forEach((v, i) => {
      const n = normalize(v);
      if (!n || n.length < 8) return;
      const key = field + '::' + n;
      if (seen.has(key)) {
        duplicates.push({
          field,
          value: v,
          first: seen.get(key),
          second: { file: path.relative(repoRoot, file), index: i },
        });
      } else {
        seen.set(key, { file: path.relative(repoRoot, file), index: i });
      }
    });
  }
}

if (duplicates.length > 0) {
  console.error('[uniqueness] FAIL: duplicate programmatic page copy detected:');
  for (const d of duplicates) {
    console.error(
      `  - field=${d.field} value="${d.value.slice(0, 80)}"\n      first:  ${d.first.file}#${d.first.index}\n      second: ${d.second.file}#${d.second.index}`
    );
  }
  process.exit(1);
}

console.log('[uniqueness] OK: no duplicate meta/H1/intro copy across programmatic pages.');
