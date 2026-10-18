export type GalleryProbeItem = {
  id: string;
  title: string;
  src: string;
  alt: string;
};

export const galleryProbeImages: GalleryProbeItem[] = [
  { id: 'p1', title: 'Probe One', src: '/images/probe-1.jpg', alt: 'First probe image' },
  { id: 'p2', title: 'Probe Two', src: '/images/probe-2.jpg', alt: 'Second probe image' },
  { id: 'p3', title: 'Probe Three', src: '/images/probe-3.jpg', alt: 'Third probe image' },
  { id: 'p4', title: 'Probe Four', src: '/images/probe-4.jpg', alt: 'Fourth probe image' },
];

export default galleryProbeImages;
