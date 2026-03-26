// app/utils/seo.ts

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;       // For Canonical links to prevent duplicate content
  image?: string;     // The preview image for iMessage, WhatsApp, Facebook
  schema?: object | object[]; // Supports single schemas or arrays of schemas (like Service + FAQ)
}

export function getSeoMeta({ title, description, keywords, url, image, schema }: SEOProps) {
  const metaTags: any[] = [
    // --- Standard Meta ---
    { title: title },
    { name: "description", content: description },
    
    // --- Open Graph (Facebook, LinkedIn, iMessage, WhatsApp) ---
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "D Deep Cleaning" },
    
    // --- Twitter Cards ---
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  // --- Optional Keywords (Use sparingly) ---
  if (keywords) {
    metaTags.push({ name: "keywords", content: keywords });
  }

  // --- Canonical URLs & Social URLs ---
  if (url) {
    metaTags.push({ property: "og:url", content: url });
    // React Router v7 allows injecting <link> tags directly via the meta array!
    metaTags.push({ tagName: "link", rel: "canonical", href: url });
  }

  // --- Social Sharing Preview Image ---
  if (image) {
    metaTags.push({ property: "og:image", content: image });
    metaTags.push({ name: "twitter:image", content: image });
  }

  // --- Rich Snippets (Schema.org JSON-LD) ---
  if (schema) {
    // React Router v7 natively handles converting this object/array into a valid script tag
    metaTags.push({
      "script:ld+json": schema
    });
  }

  return metaTags;
}
