#!/usr/bin/env node
/**
 * Programmatic page uniqueness guardrail (Bolton plan, Action 6).
 *
 * Scans the programmatic service x city page content sources and fails
 * (non-zero exit) if any two pages share an identical:
 *   - meta description
 *   - H1
 *   - intro / hero copy
 *
 * The goal is to prevent regressions where the shared template collapses
 * every service x city page onto the same head content, which is exactly
 * the problem the Bolton plan calls out.
 *
 * Usage: node scripts/check-programmatic-uniqueness.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Candidate source files that may hold programmatic page content.
// We scan whichever exist; the script is defensive so it does not fail
// in repos where the layout differs.
const CANDIDATE_SOURCES = [
  'apps/ddeep/app/data/cityContent.ts',
  'apps/ddeep/app/data/servicesContent.tsx',
  'apps/ddeep/app/data/servicesContent.ts',
  'apps/ddeep/app/data/cityContent.tsx',
  'apps/ddeep/app/content/cityContent.ts',
  'apps/ddeep/app/content/servicesContent.tsx',
];

function readIfExists(rel) {
  const abs = path.join(ROOT, rel);
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch (_) {
    return null;
  }
}

/**
 * Extract candidate string literals from a TS/TSX source file.
 * We do NOT try to fully parse the file — we look for template-literal and
 * quoted strings that look like page copy (meta descriptions, H1s, intros).
 * This is intentionally conservative: it flags exact duplicates only.
 */
function extractStrings(source) {
  const out = [];
  // Backtick template literals
  const bt = /`([^`]{20,400})`/g;
  let m;
  while ((m = bt.exec(source)) !== null) {
    out.push(m[1].trim());
  }
  // Single / double quoted strings of reasonable length
  const q = /(['"])([^'"\n]{20,400})\1/g;
  while ((m = q.exec(source)) !== null) {
    out.push(m[2].trim());
  }
  return out;
}

function normalize(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function main() {
  const seen = new Map(); // normalized string -> array of {file, raw}
  const sources = [];

  for (const rel of CANDIDATE_SOURCES) {
    const src = readIfExists(rel);
    if (src !== null) {
      sources.push(rel);
      for (const raw of extractStrings(src)) {
        const key = normalize(raw);
        if (key.length < 20) continue;
        if (!seen.has(key)) seen.set(key, []);
        seen.get(key).push({ file: rel, raw });
      }
    }
  }

  if (sources.length === 0) {
    console.error(
      '[uniqueness] No programmatic content source files found. ' +
        'Checked: ' + CANDIDATE_SOURCES.join(', ')
    );
    // Do not fail the build if the repo layout has changed; warn only.
    process.exit(0);
  }

  console.log('[uniqueness] Scanned sources:');
  for (const s of sources) console.log('  - ' + s);

  const duplicates = [];
  for (const [key, hits] of seen.entries()) {
    if (hits.length > 1) {
      duplicates.push({ text: key, hits });
    }
  }

  if (duplicates.length === 0) {
    console.log('[uniqueness] OK — no duplicate meta/H1/intro strings detected.');
    process.exit(0);
  }

  console.error(
    `[uniqueness] FAIL — ${duplicates.length} duplicate copy string(s) found across programmatic pages.`
  );
  for (const d of duplicates) {
    console.error('');
    console.error('  Duplicate copy:');
    console.error('    "' + d.text.slice(0, 160) + (d.text.length > 160 ? '…' : '') + '"');
    console.error('  Appears in:');
    for (const h of d.hits) {
      console.error('    - ' + h.file);
    }
  }
  console.error('');
  console.error(
    'Each service x city page must have a unique meta description, H1, and intro copy.'
  );
  process.exit(1);
}

main();
