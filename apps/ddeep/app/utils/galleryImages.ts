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
