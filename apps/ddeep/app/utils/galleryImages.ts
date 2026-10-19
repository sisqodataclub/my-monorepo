// galleryImages.ts — thin re-export combining the gallery part modules.
// Static fallback gallery data is split across gallery_part_01/02/03.
import type { GalleryImage } from "./gallery_part_01";
import { GALLERY_PART_01 } from "./gallery_part_01";
import { GALLERY_PART_02 } from "./gallery_part_02";
import { GALLERY_PART_03 } from "./gallery_part_03";

export type { GalleryImage };

export const galleryImages: GalleryImage[] = [
  ...GALLERY_PART_01,
  ...GALLERY_PART_02,
  ...GALLERY_PART_03,
];

export default galleryImages;
