// app/utils/galleryImages.ts

export interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

export const galleryImages: GalleryImage[] = [
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
