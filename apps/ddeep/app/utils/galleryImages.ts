// app/utils/galleryImages.ts

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const R2_BASE = "https://pub-2df61503dba4466993aa38bd9fa90971.r2.dev";

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: `${R2_BASE}/recent-work-1.jpg`,
    alt: "Recent work 1",
    title: "Recent Work 1",
    category: "Recent Work",
  },
  {
    id: 2,
    src: `${R2_BASE}/recent-work-2.jpg`,
    alt: "Recent work 2",
    title: "Recent Work 2",
    category: "Recent Work",
  },
  {
    id: 3,
    src: `${R2_BASE}/recent-work-3.jpg`,
    alt: "Recent work 3",
    title: "Recent Work 3",
    category: "Recent Work",
  },
  {
    id: 4,
    src: `${R2_BASE}/recent-work-4.jpg`,
    alt: "Recent work 4",
    title: "Recent Work 4",
    category: "Recent Work",
  },
  {
    id: 5,
    src: `${R2_BASE}/recent-work-5.jpg`,
    alt: "Recent work 5",
    title: "Recent Work 5",
    category: "Recent Work",
  },
];
