// vite.config.ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { servicesContent } from "./app/components/landing/servicesContent";
import { targetCities } from "./app/utils/locations";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "generate-sitemap",
      closeBundle() {
        const baseUrl = "https://www.ddeepcleaningservices.com";
        const filePath = path.resolve(
          process.cwd(),
          "app/components/landing/servicesContent.tsx"
        );

        // Get honest last-modified date
        let lastModifiedDate = new Date().toISOString().split("T")[0];

        try {
          // Try Git commit date (most semantic)
          const gitDate = execSync(
            `git log -1 --format=%cd --date=iso-strict "${filePath}"`
          )
            .toString()
            .trim();
          if (gitDate) {
            lastModifiedDate = gitDate.split("T")[0];
          } else {
            throw new Error("No git date");
          }
        } catch {
          try {
            // Fallback to file system modification time
            const stats = fs.statSync(filePath);
            lastModifiedDate = stats.mtime.toISOString().split("T")[0];
          } catch {
            console.warn(
              "[Sitemap] Could not read file stats. Using today's date as fallback."
            );
          }
        }

        // 1. Base pages (Homepage)
        const pages: { url: string; priority: string }[] = [
          { url: "/", priority: "1.0" },
        ];

        // 2. Core Service pages
        Object.keys(servicesContent)
          .filter((slug) => slug !== "tc")
          .forEach((slug) => {
            pages.push({
              url: `/services/${slug}/`,
              priority: "0.8",
            });
          });

        // 3. Location Hub pages (/locations/[city]/)
        targetCities.forEach((citySlug) => {
          pages.push({
            url: `/locations/${citySlug}/`,
            priority: "0.7",
          });
        });

        // 4. Hyper-Local Service pages (/services/[service]/in/[city]/)
        Object.keys(servicesContent)
          .filter((slug) => slug !== "tc")
          .forEach((serviceSlug) => {
            targetCities.forEach((citySlug) => {
              pages.push({
                url: `/services/${serviceSlug}/in/${citySlug}/`,
                priority: "0.6",
              });
            });
          });

        // Generate the XML
        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
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

        // Write to React Router's build/client output folder
        const outDir = path.resolve(process.cwd(), "build/client");
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }

        const outputPath = path.resolve(outDir, "sitemap.xml");
        fs.writeFileSync(outputPath, sitemapXML, "utf-8");
        console.log(`✅ Sitemap generated at ${outputPath}`);
        console.log(`    📅 lastmod: ${lastModifiedDate}`);
        console.log(`    📄 Total Indexed Pages: ${pages.length}`);
      },
    },
  ],
});
