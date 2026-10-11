#!/usr/bin/env node
/**
 * check-programmatic-uniqueness.js
 *
 * Action 6 guardrail: fails if any two programmatic service x city pages
 * share identical meta-description, H1, or intro copy.
 *
 * Scans:
 *   apps/ddeep/app/data/cityContent.ts
 *   apps/ddeep/app/data/servicesContent.tsx
 * (falls back to any file matching cityContent.ts / servicesContent.tsx under apps/)
 *
 * Exit 0 = unique. Exit 1 = duplicates found (prints offending pairs).
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

function findFile(names) {
  const roots = [
    path.join(REPO_ROOT, 'apps/ddeep/app'),
    path.join(REPO_ROOT, 'apps/ddeep/app/data'),
    path.join(REPO_ROOT, 'apps/ddeep'),
    path.join(REPO_ROOT, 'apps'),
  ];
  for (const name of names) {
    for (const r of roots) {
      const p = path.join(r, name);
      if (fs.existsSync(p)) return p;
    }
  }
  // recursive fallback
  const stack = [REPO_ROOT];
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (names.includes(e.name)) return full;
    }
  }
  return null;
}

function parseContent(file) {
  if (!file) return [];
  const src = fs.readFileSync(file, 'utf8');
  const records = [];

  // Look for keyed object entries: slug: { meta, h1, intro, ... }
  // We use a light scan: find all `metaDescription`, `meta_description`, `description`,
  // `h1`, `heading`, `intro`, `introCopy` string literals alongside the nearest key.
  const keyRe = /(?:^|\n)\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_\-]+))\s*:\s*\{/g;
  let m;
  while ((m = keyRe.exec(src)) !== null) {
    const key = m[1] || m[2] || m[3];
    const start = m.index + m[0].length;
    // find matching closing brace (naive but adequate)
    let depth = 1, i = start;
    while (i < src.length && depth > 0) {
      const ch = src[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    const body = src.slice(start, i);
    const pick = (names) => {
      for (const n of names) {
        const re = new RegExp(n + "\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\"|`([^`]*)`)");
        const mm = body.match(re);
        if (mm) return (mm[1] || mm[2] || mm[3] || '').trim();
      }
      return '';
    };
    records.push({
      file,
      key,
      meta: pick(['metaDescription', 'meta_description', 'meta', 'description']),
      h1: pick(['h1', 'heading', 'title']),
      intro: pick(['intro', 'introCopy', 'intro_copy', 'introText', 'body']),
    });
  }
  return records;
}

function findDuplicates(records, field) {
  const map = new Map();
  for (const r of records) {
    const v = (r[field] || '').trim();
    if (!v) continue;
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(r);
  }
  const dups = [];
  for (const [value, list] of map.entries()) {
    if (list.length > 1) dups.push({ value, list });
  }
  return dups;
}

function main() {
  const cityFile = findFile(['cityContent.ts', 'cityContent.tsx', 'cityContent.js']);
  const svcFile = findFile(['servicesContent.tsx', 'servicesContent.ts', 'servicesContent.js']);

  const records = [
    ...parseContent(cityFile),
    ...parseContent(svcFile),
  ];

  if (records.length === 0) {
    console.log('[uniqueness] No content records parsed — nothing to check.');
    process.exit(0);
  }

  const fields = [
    ['meta', 'meta-description'],
    ['h1', 'H1'],
    ['intro', 'intro copy'],
  ];

  let failed = false;
  for (const [field, label] of fields) {
    const dups = findDuplicates(records, field);
    if (dups.length === 0) continue;
    failed = true;
    console.error('\n[uniqueness] Duplicate ' + label + ' detected:');
    for (const d of dups) {
      console.error('  value: ' + JSON.stringify(d.value.slice(0, 120)) + (d.value.length > 120 ? '…' : ''));
      for (const r of d.list) {
        console.error('    - ' + path.relative(REPO_ROOT, r.file) + ' :: ' + r.key);
      }
    }
  }

  if (failed) {
    console.error('\n[uniqueness] FAIL — programmatic pages share identical copy. Make meta-description, H1, and intro unique per service x city.');
    process.exit(1);
  }

  console.log('[uniqueness] OK — ' + records.length + ' records scanned, no duplicate meta/H1/intro.');
  process.exit(0);
}

main();
