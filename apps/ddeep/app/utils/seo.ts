// app/utils/seo.ts
import type { MetaDescriptor } from "react-router";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;        // Explicit canonical link (must match Nginx trailing slashes)
  image?: string;      // Preview image for iMessage, WhatsApp, Facebook
  noindex?: boolean;   // Explicit robots control — default is index,follow
}

/**
 * Normalize a URL path to the canonical trailing-slash form used by Nginx.
 * - Preserves origin/query/hash if present.
 * - Leaves the root "/" untouched.
 * - Leaves file-like paths (containing a dot in the last segment) untouched.
 */
export function normalizeCanonicalUrl(input: string): string {
  if (!input) return input;
  try {
    // Absolute URL
    if (/^https?:\/\//i.test(input)) {
      const u = new URL(input);
      u.pathname = normalizePath(u.pathname);
      return u.toString();
    }
    // Relative path
    return normalizePath(input);
  } catch {
    return input;
  }
}

function normalizePath(pathname: string): string {
  if (!pathname) return pathname;
  // Split off query/hash if present on relative paths
  const match = pathname.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return pathname;
  let path = match[1] || "/";
  const suffix = match[2] || "";
  // Already root
  if (path === "/") return path + suffix;
  // Skip file-like paths (e.g. /sitemap.xml, /favicon.svg)
  const lastSegment = path.split("/").filter(Boolean).pop() || "";
  if (lastSegment.includes(".")) return path + suffix;
  // Ensure trailing slash
  if (!path.endsWith("/")) path = path + "/";
  return path + suffix;
}

export function getSeoMeta({
  title,
  description,
  keywords,
  url,
  image,
  noindex = false,
}: SEOProps): MetaDescriptor[] {
  const metaTags: MetaDescriptor[] = [
    // --- Standard Meta ---
    { title },
    { name: "description", content: description },

    // --- Robots (explicit; never rely on absence) ---
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },

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

  // --- Canonical URL (correct React Router v7 syntax, trailing-slash normalized) ---
  if (url) {
    const canonical = normalizeCanonicalUrl(url);
    metaTags.push({ property: "og:url", content: canonical });
    metaTags.push({
      tag: "link",
      rel: "canonical",
      href: canonical,
    } as MetaDescriptor);
  }

  // --- Social Preview Image (with fallback) ---
  const previewImage = image || "https://www.ddeepcleaningservices.com/favicon.svg";
  metaTags.push({ property: "og:image", content: previewImage });
  metaTags.push({ name: "twitter:image", content: previewImage });

  return metaTags;
}
