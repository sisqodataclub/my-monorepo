// app/utils/galleryImages.ts
//
// Bucket-driven gallery loader for ddeep.
//
// R2 / Cloudflare env vars (add these as GitHub/Cloudflare secrets — never hardcode):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME
//   R2_PUBLIC_BASE_URL   (e.g. https://ddeepcleaningservices.franciscodes.com/)
//
// At build time Vite exposes them as import.meta.env.VITE_R2_* ; at runtime
// (SSR-off / prerender) we also read process.env.R2_* . If any are missing the
// loader returns [] (empty array) and logs ONE warning — it never throws and
// never breaks the build. HomeGallery falls back to the static FALLBACK_IMAGES.
//
// Expected bucket layout: a JSON manifest at `<bucket>/gallery.json` shaped as
//   { "items": [ { "key": "bathroom-deep-clean.jpg", "caption": "..." }, ... ] }
// with optional sidecar metadata. If no manifest exists we derive alt/title
// from the filename (kebab/snake -> Title Case).

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
  caption?: string;
}

const PUBLIC_BASE_URL_DEFAULT = "https://ddeepcleaningservices.franciscodes.com/";

function normaliseBaseUrl(raw: string | undefined | null): string {
  const base = (raw && raw.trim()) || PUBLIC_BASE_URL_DEFAULT;
  return base.replace(/\/+$/, "");
}

function readEnv(name: string): string | undefined {
  // Vite build-time (preferred) then Node runtime.
  try {
    // @ts-ignore - import.meta.env is Vite-injected
    const viteEnv = typeof import.meta !== "undefined" && (import.meta as any).env;
    if (viteEnv) {
      const v = viteEnv[`VITE_${name}`] ?? viteEnv[name];
      if (v) return String(v);
    }
  } catch {
    /* ignore */
  }
  try {
    if (typeof process !== "undefined" && process.env) {
      const v = process.env[`VITE_${name}`] ?? process.env[name];
      if (v) return String(v);
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function getR2Config() {
  const accountId = readEnv("R2_ACCOUNT_ID");
  const accessKeyId = readEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = readEnv("R2_SECRET_ACCESS_KEY");
  const bucketName = readEnv("R2_BUCKET_NAME");
  const publicBaseUrl = readEnv("R2_PUBLIC_BASE_URL");
  const missing = [
    ["R2_ACCOUNT_ID", accountId],
    ["R2_ACCESS_KEY_ID", accessKeyId],
    ["R2_SECRET_ACCESS_KEY", secretAccessKey],
    ["R2_BUCKET_NAME", bucketName],
    ["R2_PUBLIC_BASE_URL", publicBaseUrl],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicBaseUrl: normaliseBaseUrl(publicBaseUrl),
    missing,
  };
}

function titleCaseFromFilename(filename: string): string {
  const stem = filename.replace(/\.[a-zA-Z0-9]+$/, "");
  return stem
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function inferCategory(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("carpet")) return "Carpet Cleaning";
  if (lower.includes("tenan")) return "End of Tenancy";
  if (lower.includes("office") || lower.includes("commercial")) return "Office Cleaning";
  if (lower.includes("oven") || lower.includes("appliance")) return "Appliance Cleaning";
  if (lower.includes("bath") || lower.includes("kitchen")) return "Deep Cleaning";
  return "Gallery";
}

// Static fallback: used when the bucket is empty or unconfigured.
export const FALLBACK_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "Bathroom deep clean and tile descaling in Manchester",
    title: "Bathroom Sanitisation & Deep Clean",
    category: "Deep Cleaning",
  },
];
