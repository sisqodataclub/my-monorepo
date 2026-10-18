// gallery_part_01.ts — GalleryImage type + static fallback images (items 1-2)
export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
  caption?: string;
}

export const GALLERY_PART_01: GalleryImage[] = [
  {
    id: 1,
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkSYa5ubSk2toRpp6xzBXmuGy7vHNVFL4_fnIu0_2pKKc5YgaDSDek2jtWP932DquSFWu1PkcTfB8zHuHhRZ_PT9w81_A-7lAleWauP7po4NguFrHMdEyAWGYZUbCLAqM4_yOaEB2bAT3ae=s680-w680-h510-rw",
    alt: "Bathroom deep clean and tile descaling in Manchester",
    title: "Bathroom Sanitisation & Deep Clean",
    category: "Deep Cleaning",
  },
];
