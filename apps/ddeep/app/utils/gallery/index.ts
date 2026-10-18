// gallery/index.ts — assembles FALLBACK_IMAGES from split parts
export type { GalleryImage } from "../gallery_part_01";
export { GALLERY_PART_01 } from "../gallery_part_01";
export { GALLERY_PART_02 } from "../gallery_part_02";
export { GALLERY_PART_03 } from "../gallery_part_03";
export { GALLERY_PART_04 } from "../gallery_part_04";

import type { GalleryImage } from "../gallery_part_01";
import { GALLERY_PART_01 } from "../gallery_part_01";
import { GALLERY_PART_02 } from "../gallery_part_02";
import { GALLERY_PART_03 } from "../gallery_part_03";
import { GALLERY_PART_04 } from "../gallery_part_04";

export const FALLBACK_IMAGES: GalleryImage[] = [
  ...GALLERY_PART_01,
  ...GALLERY_PART_02,
  ...GALLERY_PART_03,
  ...GALLERY_PART_04,
];

export const galleryImages: GalleryImage[] = FALLBACK_IMAGES;
