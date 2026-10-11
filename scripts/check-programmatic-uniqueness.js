#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic page uniqueness check.
 *
 * Fails (non-zero exit) if any two programmatic service x city pages
 * share identical meta-description, H1, or intro copy.
 *
 * Scans cityContent.* and servicesContent.* source files under apps/ddeep.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANDIDATE_DIRS = [
  path.join(ROOT, 'apps', 'ddeep', 'app'),
  path.join(ROOT, 'apps', 'ddeep'),
  path.join(ROOT, 'apps', 'ddeep', 'app', 'data'),
  path.join(ROOT, 'apps', 'ddeep', 'app', 'content'),
];

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name)) out.push(p);
  }
}

function findContentFiles() {
  const found = [];
  for (const d of CANDIDATE_DIRS) walk(d, found);
  return found.filter((f) => /(cityContent|servicesContent)/i.test(path.basename(f)));
}

// Extract string literals that look like descriptions / H1s / intros.
function extractFields(src) {
  const fields = [];
  const patterns = [
    { key: 'metaDescription', re: /metaDescription\s*:\s*[`'"]([^`'"]{20,})[`'"]/g },
    { key: 'description', re: /description\s*:\s*[`'"]([^`'"]{20,})[`'"]/g },
    { key: 'h1', re: /h1\s*:\s*[`'"]([^`'"]{10,})[`'"]/g },
    { key: 'heading', re: /heading\s*:\s*[`'"]([^`'"]{10,})[`'"]/g },
    { key: 'intro', re: /intro\s*:\s*[`'"]([^`'"]{20,})[`'"]/g },
    { key: 'introCopy', re: /introCopy\s*:\s*[`'"]([^`'"]{20,})[`'"]/g },
  ];
  for (const { key, re } of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      fields.push({ key, value: m[1].trim() });
    }
  }
  return fields;
}

function main() {
  const files = findContentFiles();
  if (files.length === 0) {
    console.error('[seo-guardrails] No cityContent/servicesContent files found. Skipping (nothing to check).');
    process.exit(0);
  }

  const seen = new Map(); // `${key}::${value}` -> file
  const collisions = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const fields = extractFields(src);
    for (const { key, value } of fields) {
      const sig = `${key}::${value}`;
      if (seen.has(sig)) {
        collisions.push({ key, value, a: seen.get(sig), b: file });
      } else {
        seen.set(sig, file);
      }
    }
  }

  if (collisions.length > 0) {
    console.error(`[seo-guardrails] FAIL: ${collisions.length} duplicate programmatic field(s) detected.`);
    for (const c of collisions) {
      console.error(`\n  Field: ${c.key}`);
      console.error(`  Value: ${JSON.stringify(c.value.slice(0, 120))}`);
      console.error(`  A: ${path.relative(ROOT, c.a)}`);
      console.error(`  B: ${path.relative(ROOT, c.b)}`);
    }
    process.exit(1);
  }

  console.log(`[seo-guardrails] OK: scanned ${files.length} file(s), no duplicate meta-description/H1/intro copy.`);
}

main();
