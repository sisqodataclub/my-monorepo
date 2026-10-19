// app/utils/galleryImages.ts
//
// Gallery images are loaded dynamically from a Cloudflare R2 bucket.
// The bucket name, credentials and public base URL are read from the
// environment (.env on the VPS). No filenames are hardcoded here — the
// loader lists every object in the bucket and keeps only image files.
//
// Required env vars:
//   R2_BUCKET             – bucket name
//   R2_ACCOUNT_ID         – Cloudflare account id
//   R2_ACCESS_KEY_ID      – S3-compatible access key id
//   R2_SECRET_ACCESS_KEY  – S3-compatible secret access key
//   R2_PUBLIC_BASE_URL    – public bucket URL (defaults to the project bucket)

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const DEFAULT_PUBLIC_BASE_URL =
  "https://pub-2df61503dba4466993aa38bd9fa90971.r2.dev";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImageKey(key: string): boolean {
  const lower = key.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function titleFromKey(key: string): string {
  const filename = key.split("/").pop() ?? key;
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function altFromKey(key: string): string {
  return `${titleFromKey(key)} — recent cleaning work by DDeep`;
}

/**
 * List every image object in the configured R2 bucket and map it to a
 * GalleryImage. Returns an empty array if credentials are missing or the
 * listing call fails (e.g. local dev without .env), so the build never
 * crashes.
 */
export async function loadGalleryImages(): Promise<GalleryImage[]> {
  const bucket = process.env.R2_BUCKET;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicBaseUrl = (
    process.env.R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL
  ).replace(/\/$/, "");

  if (!bucket || !accountId || !accessKeyId || !secretAccessKey) {
    // No credentials — local dev / CI. Fail soft.
    return [];
  }

  try {
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    const keys: string[] = [];
    let continuationToken: string | undefined = undefined;

    do {
      const res = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of res.Contents ?? []) {
        if (obj.Key && isImageKey(obj.Key)) keys.push(obj.Key);
      }
      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (continuationToken);

    keys.sort();

    return keys.map((key, index) => ({
      id: index + 1,
      src: `${publicBaseUrl}/${key}`,
      alt: altFromKey(key),
      title: titleFromKey(key),
      category: "Recent Work",
    }));
  } catch (err) {
    // Listing failed — do not crash the build.
    console.warn(
      "[galleryImages] Failed to list R2 bucket, returning empty gallery:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

/**
 * Backwards-compatible static export. Callers that still import
 * `galleryImages` directly get an empty array — the dynamic list is
 * fetched via `loadGalleryImages()` from a route loader.
 */
export const galleryImages: GalleryImage[] = [];
