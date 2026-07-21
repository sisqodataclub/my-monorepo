import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { servicesContent } from "../components/landing/servicesContent";

export async function loader() {
  const baseUrl = "https://www.ddeepcleaningservices.com";

  // ============================================================
  // STEP 1: Get the honest last-modified date
  // ============================================================
  const filePath = path.resolve(
    process.cwd(),
    "app/components/landing/servicesContent.ts"
  );

  let lastModifiedDate: string;

  try {
    // Option A: Try to get the Git commit date (most semantic)
    // This only changes when you actually commit a change
    const gitDate = execSync(
      `git log -1 --format=%cd --date=iso-strict "${filePath}"`
    )
      .toString()
      .trim();

    if (gitDate) {
      lastModifiedDate = gitDate.split("T")[0];
    } else {
      throw new Error("No git date found");
    }
  } catch {
    // Option B: Fallback to file system modification time
    try {
      const stats = fs.statSync(filePath);
      lastModifiedDate = stats.mtime.toISOString().split("T")[0];
    } catch {
      // Option C: Ultimate fallback – today's date
      // This should never happen in production, but it's safe
      console.warn(
        "[Sitemap] Could not read file stats or git log. Using today's date as fallback."
      );
      lastModifiedDate = new Date().toISOString().split("T")[0];
    }
  }

  // ============================================================
  // STEP 2: Build the page list
  // ============================================================
  const pages = [
    // Homepage
    { url: "/", priority: "1.0" },

    // All service pages (dynamically generated from servicesContent)
    // ✅ Trailing slashes are included to prevent redirects
    // ✅ /tc/ is explicitly excluded
    ...Object.keys(servicesContent)
      .filter((slug) => slug !== "tc") // safety net – but your servicesContent doesn't contain "tc"
      .map((slug) => ({
        url: `/services/${slug}/`,
        priority: "0.8",
      })),
  ];

  // ============================================================
  // STEP 3: Generate the XML
  // ============================================================
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastModifiedDate}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  // ============================================================
  // STEP 4: Return the response with proper headers
  // ============================================================
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache for 1 hour – short enough that deployments update quickly,
      // long enough to reduce server load
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
