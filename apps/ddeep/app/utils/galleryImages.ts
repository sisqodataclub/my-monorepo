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
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "Kitchen deep cleaning and appliance sanitisation in Manchester",
    title: "Kitchen Deep Clean & Appliance Sanitisation",
    category: "Deep Cleaning",
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "Carpet cleaning and stain removal in Manchester",
    title: "Carpet Cleaning & Stain Removal",
    category: "Carpet Cleaning",
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "End of tenancy cleaning in Manchester",
    title: "End of Tenancy Clean",
    category: "End of Tenancy",
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "Office and commercial cleaning in Manchester",
    title: "Office & Commercial Cleaning",
    category: "Office Cleaning",
  },
];

/**
 * Fetch the gallery manifest from the R2 bucket and return GalleryImage[].
 * Returns [] if the bucket is unconfigured or the manifest is unreachable.
 */
export async function fetchGalleryFromBucket(): Promise<GalleryImage[]> {
  const cfg = getR2Config();
  if (cfg.missing.length > 0) {
    console.warn(
      `[galleryImages] R2 not configured (missing: ${cfg.missing.join(", ")}) — using static fallback.`
    );
    return [];
  }
  try {
    const manifestUrl = `${cfg.publicBaseUrl}/gallery.json`;
    const res = await fetch(manifestUrl, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[galleryImages] gallery.json returned HTTP ${res.status} — using static fallback.`);
      return [];
    }
    const data = await res.json();
    const items: Array<{ key?: string; caption?: string; alt?: string; title?: string; category?: string }> =
      Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    if (items.length === 0) {
      console.warn("[galleryImages] gallery.json has no items — using static fallback.");
      return [];
    }
    return items
      .filter((it) => it && it.key)
      .map((it, idx) => {
        const key = String(it.key);
        const title = it.title || titleCaseFromFilename(key);
        return {
          id: key,
          src: `${cfg.publicBaseUrl}/${key.replace(/^\/+/, "")}`,
          alt: it.alt || `${title} — DDeep Cleaning Services Manchester`,
          title,
          category: it.category || inferCategory(key),
          caption: it.caption,
        };
      });
  } catch (err) {
    console.warn("[galleryImages] Failed to fetch gallery manifest — using static fallback.", err);
    return [];
  }
}

/**
 * Load gallery images: try the bucket first, fall back to the static array.
 */
export async function loadGalleryImages(): Promise<GalleryImage[]> {
  const bucketImages = await fetchGalleryFromBucket();
  if (bucketImages.length > 0) return bucketImages;
  return FALLBACK_IMAGES;
}

// Backwards-compatible default export: the static fallback array.
export const galleryImages = FALLBACK_IMAGES;
