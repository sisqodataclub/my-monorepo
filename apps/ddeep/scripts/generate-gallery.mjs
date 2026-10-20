// apps/ddeep/scripts/generate-gallery.mjs
//
// Runs before `pnpm build` (via prebuild hook). Lists every image in
// the R2 bucket and writes app/utils/galleryImages.generated.ts.
//
// Credentials come from env vars during the Docker build only — they
// never end up in the shipped bundle. If credentials are missing or
// the R2 call fails, an empty gallery is written and the build
// continues (so local dev and CI don't break).

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("app/utils/galleryImages.generated.ts");
const DEFAULT_BASE = "https://pub-2df61503dba4466993aa38bd9fa90971.r2.dev";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function writeEmpty(reason) {
  console.log(`[generate-gallery] ${reason} — writing empty gallery`);
  writeFileSync(
    OUT,
    [
      'import type { GalleryImage } from "./galleryImages";',
      "",
      "export const galleryImages: GalleryImage[] = [];",
      "",
    ].join("\n"),
  );
}

async function main() {
  const {
    R2_ACCOUNT_ID,
    R2_BUCKET,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_PUBLIC_BASE_URL,
  } = process.env;

  if (!R2_ACCOUNT_ID || !R2_BUCKET || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    writeEmpty("R2 credentials not set");
    return;
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  const base = (R2_PUBLIC_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");
  const keys = [];
  let token;

  try {
    do {
      const res = await client.send(
        new ListObjectsV2Command({ Bucket: R2_BUCKET, ContinuationToken: token }),
      );
      for (const obj of res.Contents ?? []) {
        if (obj.Key && IMAGE_EXT.some((e) => obj.Key.toLowerCase().endsWith(e))) {
          keys.push(obj.Key);
        }
      }
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
  } catch (err) {
    writeEmpty(`R2 list failed: ${err instanceof Error ? err.message : err}`);
    return;
  }

  keys.sort();

  const entries = keys.map((key, i) => {
    const filename = key.split("/").pop() ?? key;
    const title = filename
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: i + 1,
      src: `${base}/${key}`,
      alt: `${title} — recent cleaning work by DDeep`,
      title,
      category: "Recent Work",
    };
  });

  writeFileSync(
    OUT,
    [
      'import type { GalleryImage } from "./galleryImages";',
      "",
      `export const galleryImages: GalleryImage[] = ${JSON.stringify(entries, null, 2)};`,
      "",
    ].join("\n"),
  );
  console.log(`[generate-gallery] Wrote ${entries.length} images to ${OUT}`);
}

main().catch((err) => {
  console.error("[generate-gallery] Unexpected error:", err);
  process.exit(1);
});
