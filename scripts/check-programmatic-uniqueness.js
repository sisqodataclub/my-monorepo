#!/usr/bin/env node
/**
 * Action 6 guardrail: programmatic service x city page uniqueness check.
 *
 * Scans the programmatic page content sources (cityContent.ts / servicesContent.tsx)
 * and FAILS (non-zero exit) if any two pages share an identical:
 *   - meta description
 *   - H1
 *   - intro copy
 *
 * Prints offending pairs to stdout.
 *
 * Usage: node scripts/check-programmatic-uniqueness.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// Candidate source files for programmatic service x city content.
const CANDIDATE_FILES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
  'apps/ddeep/app/utils/cityContent.ts',
  'apps/ddeep/app/utils/servicesContent.tsx',
  'apps/ddeep/app/cityContent.ts',
  'apps/ddeep/app/servicesContent.tsx',
  'cityContent.ts',
  'servicesContent.tsx',
];

function findSourceFiles() {
  const found = [];
  for (const rel of CANDIDATE_FILES) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) found.push(abs);
  }
  // Fallback: shallow walk of apps/ddeep for matching filenames.
  if (found.length === 0) {
    const roots = [path.join(ROOT, 'apps'), path.join(ROOT, 'src')];
    for (const r of roots) {
      if (!fs.existsSync(r)) continue;
      walk(r, (abs) => {
        const base = path.basename(abs);
        if (base === 'cityContent.ts' || base === 'servicesContent.tsx') {
          found.push(abs);
        }
      });
    }
  }
  return found;
}

function walk(dir, cb, depth = 0) {
  if (depth > 6) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === 'build') continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, cb, depth + 1);
    else cb(abs);
  }
}

/**
 * Heuristically extract page records from a source file.
 * Looks for object literals that contain a slug/city/service identifier plus
 * a metaDescription / description, an h1 / title, and an intro / introCopy.
 * This is intentionally tolerant: it does not require a specific schema.
 */
function extractPages(source, filePath) {
  const pages = [];

  // Split on top-level object-ish boundaries. We look for blocks between { ... }
  // that contain at least one of our target keys.
  const keyPatterns = {
    meta: /(metaDescription|meta_description|metaDesc|description)\s*:\s*(['"`])([\s\S]*?)\2/g,
    h1: /(h1|heading|title)\s*:\s*(['"`])([\s\S]*?)\2/g,
    intro: /(intro|introCopy|introText|lead|subhead)\s*:\s*(['"`])([\s\S]*?)\2/g,
    id: /(slug|city|citySlug|service|serviceSlug|key|id)\s*:\s*(['"`])([\s\S]*?)\2/g,
  };

  // Find candidate object blocks by scanning for each occurrence of an id key.
  // We use a coarse approach: for each id match, capture a window of the source
  // around it and pull the nearest meta/h1/intro within that window.
  const idRe = new RegExp(keyPatterns.id.source, 'g');
  let m;
  while ((m = idRe.exec(source)) !== null) {
    const start = m.index;
    const end = Math.min(source.length, start + 2000);
    const window = source.slice(start, end);

    const metaMatch = new RegExp(keyPatterns.meta.source).exec(window);
    const h1Match = new RegExp(keyPatterns.h1.source).exec(window);
    const introMatch = new RegExp(keyPatterns.intro.source).exec(window);

    if (!metaMatch && !h1Match && !introMatch) continue;

    pages.push({
      file: filePath,
      id: m[3] ? m[3].trim() : `#${start}`,
      meta: metaMatch ? metaMatch[3].trim() : null,
      h1: h1Match ? h1Match[3].trim() : null,
      intro: introMatch ? introMatch[3].trim() : null,
    });
  }

  return pages;
}

function main() {
  const files = findSourceFiles();
  if (files.length === 0) {
    console.error('[uniqueness] No programmatic content source files found.');
    console.error('[uniqueness] Looked for cityContent.ts / servicesContent.tsx under apps/ and src/.');
    // Do not fail the build if sources are absent — but warn loudly.
    process.exit(0);
  }

  const allPages = [];
  for (const f of files) {
    let src;
    try {
      src = fs.readFileSync(f, 'utf8');
    } catch (_) {
      continue;
    }
    const pages = extractPages(src, f);
    allPages.push(...pages);
  }

  if (allPages.length === 0) {
    console.error('[uniqueness] Found source files but extracted 0 pages.');
    console.error('[uniqueness] Check that meta/h1/intro fields are present as string literals.');
    process.exit(0);
  }

  const fields = [
    { name: 'meta description', key: 'meta' },
    { name: 'H1', key: 'h1' },
    { name: 'intro copy', key: 'intro' },
  ];

  let violations = 0;

  for (const field of fields) {
    const seen = new Map(); // value -> first page
    for (const page of allPages) {
      const val = page[field.key];
      if (!val || val.length < 8) continue; // ignore trivially short/empty values
      const norm = val.replace(/\s+/g, ' ').trim().toLowerCase();
      if (seen.has(norm)) {
        const first = seen.get(norm);
        violations++;
        console.error(`\n[uniqueness] DUPLICATE ${field.name} detected:`);
        console.error(`  - ${first.file} :: ${first.id}`);
        console.error(`  - ${page.file} :: ${page.id}`);
        console.error(`  value: "${val.slice(0, 160)}${val.length > 160 ? '...' : ''}"`);
      } else {
        seen.set(norm, page);
      }
    }
  }

  if (violations > 0) {
    console.error(`\n[uniqueness] FAILED: ${violations} duplicate(s) found across ${allPages.length} programmatic pages.`);
    process.exit(1);
  }

  console.log(`[uniqueness] OK: ${allPages.length} programmatic pages checked, no duplicate meta/H1/intro.`);
  process.exit(0);
}

main();
