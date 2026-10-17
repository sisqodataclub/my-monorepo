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
  return "Deep Cleaning";
}

interface ManifestItem {
  key?: string;
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  category?: string;
}

interface Manifest {
  items?: ManifestItem[];
}

function buildImage(item: ManifestItem, index: number, baseUrl: string): GalleryImage | null {
  const key = item.key ?? item.src;
  if (!key) return null;
  const filename = key.split("/").pop() || key;
  const src = /^https?:\/\//i.test(key) ? key : `${baseUrl}/${key.replace(/^\/+/, "")}`;
  const derived = titleCaseFromFilename(filename);
  const alt = item.alt || `${derived} — DDeep Cleaning Services`;
  const title = item.title || derived;
  const category = item.category || inferCategory(filename);
  const out: GalleryImage = {
    id: index + 1,
    src,
    alt,
    title,
    category,
  };
  if (item.caption) out.caption = item.caption;
  return out;
}

async function loadFromBucket(): Promise<GalleryImage[]> {
  const cfg = getR2Config();
  if (cfg.missing.length > 0) {
    // Single warning, never throw, never break the build.
    // eslint-disable-next-line no-console
    console.warn(
      `[galleryImages] R2 not configured (missing: ${cfg.missing.join(
        ", "
      )}). Falling back to static gallery. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL as secrets to enable bucket listing.`
    );
    return [];
  }

  const manifestUrl = `${cfg.publicBaseUrl}/gallery.json`;
  try {
    const res = await fetch(manifestUrl, { cache: "no-store" });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[galleryImages] Bucket manifest not found at ${manifestUrl} (status ${res.status}). Falling back to static gallery.`
      );
      return [];
    }
    const json = (await res.json()) as Manifest;
    const items = Array.isArray(json?.items) ? json.items : [];
    const mapped = items
      .map((it, i) => buildImage(it, i, cfg.publicBaseUrl))
      .filter((x): x is GalleryImage => x !== null);
    return mapped;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[galleryImages] Failed to load bucket manifest (${(err as Error)?.message ??
        "unknown error"}). Falling back to static gallery.`
    );
    return [];
  }
}

// Static fallback — used when R2 is unconfigured or the bucket manifest is empty.
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
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmnLLGyaO-6fbx02qSjTIQFoBXTLt5pazmoDWGMiAYafPx_AlV-P9gHbHafmA_uFSdSOEhSYfJGzL-wBwfNtE9Ytbkj8o4YkZp7Buh24403VzeIsuaBiQGxb6uqb89lClBY_-ow=s680-w680-h510-rw",
    alt: "End of tenancy kitchen deep clean in Salford Quays",
    title: "End of Tenancy Kitchen Reset",
    category: "End of Tenancy",
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmPjQAdssxCGEXjjrwZN7Hj3ha0XCCDgAce4ZJ5X2CQ-amBKdbQIRwcvttnvK_TdeUrBxwbsIpb2DRSzRSeBM-QpugbYIx4yRD4QrA934tUfEbVogo2G2EaxjB8qbqnMWFq6Kjc=s680-w680-h510-rw",
    alt: "Professional carpet steam cleaning in Bolton",
    title: "Hot Water Extraction Carpet Clean",
    category: "Carpet Cleaning",
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkVfzbcg2VeHGgtuklCJp5DFuBE1S-rVegxP32qSNXeRz48XDUrFpqMv4iSpn_A2glsb-eLZUBOoIWriki5tPW54zKGI3T2F2YKchNVJ05Cm37xt8obWAJG8lK91lP_8u2SJ5rV=s680-w680-h510-rw",
    alt: "Commercial office deep cleaning in Trafford Park",
    title: "Corporate Office Desk & Floor Maintenance",
    category: "Office Cleaning",
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnT2ldwMKailK-GUHb9xt1p3EwcI6MBxBDbd4310QsuB-Ek8oHHWoEJESdDkwazJdxmmbtCEWQCglBjuXS-CHOubTp7SCXvk5tZijHvTdxMOAeAwkwIyQRy63CQUF8EQXlaUzES=s680-w680-h510-rw",
    alt: "Fume-free oven deep clean in Altrincham",
    title: "Oven & Appliance Degreasing",
    category: "Appliance Cleaning",
  },
];

// Backwards-compatible named export used by HomeGallery.tsx and other callers.
// Resolves synchronously to the static fallback so existing imports keep working;
// call `loadGalleryImages()` from a client component / loader when you want the
// bucket-backed list.
export const galleryImages: GalleryImage[] = FALLBACK_IMAGES;

/**
 * Load the gallery from the R2 bucket manifest, falling back to the static list
 * when the bucket is unconfigured or empty. Never throws.
 */
export async function loadGalleryImages(): Promise<GalleryImage[]> {
  const remote = await loadFromBucket();
  return remote.length > 0 ? remote : FALLBACK_IMAGES;
}
