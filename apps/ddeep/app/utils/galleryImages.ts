// app/utils/galleryImages.ts
//
// Thin re-export so HomeGallery.tsx import path stays identical.
// Gallery data is split across app/utils/gallery/gallery_part_0{1,2,3}.ts

import { GALLERY_PART_01 } from "./gallery/gallery_part_01";
import { GALLERY_PART_02 } from "./gallery/gallery_part_02";
import { GALLERY_PART_03 } from "./gallery/gallery_part_03";

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  ...GALLERY_PART_01,
  ...GALLERY_PART_02,
  ...GALLERY_PART_03,
];
