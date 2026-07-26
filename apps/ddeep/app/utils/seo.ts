// app/utils/seo.ts
import type { MetaDescriptor } from "react-router";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;        // Explicit canonical link (must match Nginx trailing slashes)
  image?: string;      // Preview image for iMessage, WhatsApp, Facebook
}

export function getSeoMeta({
  title,
  description,
  keywords,
  url,
  image,
}: SEOProps): MetaDescriptor[] {
  const metaTags: MetaDescriptor[] = [
    // --- Standard Meta ---
    { title },
    { name: "description", content: description },

    // --- Open Graph (Facebook, LinkedIn, iMessage, WhatsApp) ---
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "D DEEP Cleaning Services" },

    // --- Twitter Cards ---
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  // --- Optional Keywords ---
  if (keywords) {
    metaTags.push({ name: "keywords", content: keywords });
  }

  // --- Canonical URL (correct React Router v7 syntax) ---
  if (url) {
    metaTags.push({ property: "og:url", content: url });
    // ✅ Corrected: uses tag/rel/href, not tagName/attributes
    metaTags.push({
      tag: "link",
      rel: "canonical",
      href: url,
    } as MetaDescriptor);
  }

  // --- Social Preview Image (with fallback) ---
  const previewImage = image || "https://www.ddeepcleaningservices.com/favicon.svg";
  metaTags.push({ property: "og:image", content: previewImage });
  metaTags.push({ name: "twitter:image", content: previewImage });

  return metaTags;
}
