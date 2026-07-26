// app/utils/seo.ts
import type { MetaDescriptor } from "react-router";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;        // Explicit canonical link (must match Nginx trailing slashes)
  image?: string;      // Preview image for iMessage, WhatsApp, Facebook
  schema?: object | object[]; // Single schema block or an array of schemas
}

export function getSeoMeta({
  title,
  description,
  keywords,
  url,
  image,
  schema,
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

  // --- Canonical URL (correct React Router v7 custom element) ---
  if (url) {
    metaTags.push({ property: "og:url", content: url });
    metaTags.push({
      tagName: "link",
      attributes: {
        rel: "canonical",
        href: url,
      },
    } as MetaDescriptor); // Type assertion needed for custom link tag
  }

  // --- Social Preview Image (with fallback) ---
  const previewImage = image || "https://www.ddeepcleaningservices.com/favicon.svg";
  metaTags.push({ property: "og:image", content: previewImage });
  metaTags.push({ name: "twitter:image", content: previewImage });

  // --- Rich Snippets (Schema.org JSON-LD) ---
  if (schema) {
    if (Array.isArray(schema)) {
      // Automatically assigns an ID to prevent React hydration duplication
      schema.forEach((s: any, index) =>
        metaTags.push({ 
          "script:ld+json": s,
          id: `schema-${s["@type"] || index}` 
        } as any) 
      );
    } else {
      const singleSchema = schema as any;
      metaTags.push({ 
        "script:ld+json": singleSchema,
        id: `schema-${singleSchema["@type"] || "main"}`
      } as any);
    }
  }

  return metaTags;
}
