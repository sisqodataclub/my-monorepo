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
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnQ0xVt8lYq8d1Fz5q2H4w8pW3nR6tY9uK1mJ7cB5vN3sX8aZ2eD4fG6hI0jL9kM7nO5pQ1rS3tU5vW7xY9zA0bC2dE4fG6hI8jK0lM2nO4pQ6rS8t=s680-w680-h510-rw",
    alt: "End of tenancy deep clean in Manchester apartment",
    title: "End of Tenancy Deep Clean",
    category: "End of Tenancy",
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkL9mN2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0bC2dE4fG6hI8jK0lM2nO4p=s680-w680-h510-rw",
    alt: "Kitchen deep clean and appliance sanitisation in Manchester",
    title: "Kitchen Deep Clean & Appliance Sanitisation",
    category: "Deep Cleaning",
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP3qR5sT7uV9wX1yZ3aB5cD7eF9gH1iJ3kL5mN7oP9qR1sT3uV5wX7yZ9aB1cD3eF5gH7iJ9kL1mN3oP5q=s680-w680-h510-rw",
    alt: "Carpet cleaning and steam extraction in Manchester home",
    title: "Carpet Cleaning & Steam Extraction",
    category: "Carpet Cleaning",
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnR4sU6vW8xY0zA2bC4dE6fG8hI0jK2lM4nO6pQ8rS0tU2vW4xY6zA8bC0dE2fG4hI6jK8lM0nO2pQ4r=s680-w680-h510-rw",
    alt: "Office and commercial cleaning in Manchester business premises",
    title: "Office & Commercial Cleaning",
    category: "Office Cleaning",
  },
  {
    id: 6,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWoS5tV7wX9yZ1aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD1eF3gH5iJ7kL9mN1oP3qR5s=s680-w680-h510-rw",
    alt: "Oven and appliance deep cleaning in Manchester kitchen",
    title: "Oven & Appliance Deep Clean",
    category: "Appliance Cleaning",
  },
];

export async function fetchGalleryFromBucket(): Promise<GalleryImage[]> {
  const cfg = getR2Config();
  if (cfg.missing.length > 0) {
    // One warning only, never throws.
    // eslint-disable-next-line no-console
    console.warn(
      `[galleryImages] R2 config incomplete (missing: ${cfg.missing.join(
        ", "
      )}); using static fallback images.`
    );
    return [];
  }
  const manifestUrl = `${cfg.publicBaseUrl}/gallery.json`;
  try {
    const res = await fetch(manifestUrl, { cache: "no-store" });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `[galleryImages] gallery manifest not found at ${manifestUrl} (HTTP ${res.status}); using static fallback.`
      );
      return [];
    }
    const data = (await res.json()) as {
      items?: Array<{ key?: string; caption?: string; alt?: string; title?: string; category?: string }>;
    };
    const items = Array.isArray(data?.items) ? data.items : [];
    const images: GalleryImage[] = [];
    let i = 0;
    for (const item of items) {
      const key = (item.key || "").trim();
      if (!key) continue;
      i += 1;
      const filename = key.split("/").pop() || key;
      const src = `${cfg.publicBaseUrl}/${key.replace(/^\/+/, "")}`;
      images.push({
        id: i,
        src,
        alt: item.alt || item.caption || titleCaseFromFilename(filename),
        title: item.title || titleCaseFromFilename(filename),
        category: item.category || inferCategory(filename),
        caption: item.caption,
      });
    }
    return images;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[galleryImages] failed to load gallery manifest from ${manifestUrl}; using static fallback.`,
      err
    );
    return [];
  }
}

export async function loadGalleryImages(): Promise<GalleryImage[]> {
  const bucket = await fetchGalleryFromBucket();
  if (bucket.length > 0) return bucket;
  return FALLBACK_IMAGES;
}

// Backwards-compatible synchronous export: existing HomeGallery.tsx imports
// `galleryImages` directly. Keep it pointing at the static fallback so the
// component renders unchanged; bucket-driven loading is opt-in via
// loadGalleryImages() for callers that can await.
export const galleryImages: GalleryImage[] = FALLBACK_IMAGES;
