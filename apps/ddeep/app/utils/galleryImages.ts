// app/utils/galleryImages.ts
//
// Type definitions and re-export. The actual image list lives in
// galleryImages.generated.ts, written at build time by
// scripts/generate-gallery.mjs. Never edit that file by hand — it's
// regenerated on every build.
//
// Credentials for the R2 bucket are passed to the build script via
// build args (see docker-compose.yml / Dockerfile). They never reach
// the browser bundle.

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

export { galleryImages } from "./galleryImages.generated";
