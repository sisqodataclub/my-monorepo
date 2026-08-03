import type { Route } from "./+types/sitemap[.xml]";

export async function loader({ request }: Route.LoaderArgs) {
    const baseUrl = "https://www.ddeepcleaningservices.com";
    const urls = [
        "",
        "/services",
        "/services/end-of-tenancy-cleaning",
        "/services/carpet-cleaning",
        "/services/office-cleaning",
        "/services/domestic-cleaning",
        "/services/window-cleaning",
        "/services/after-builders-cleaning",
        "/contact",
        "/about",
    ];

    const urlSet = urls.map((url) => {
        const fullUrl = `${baseUrl}${url}`;
        return `
            <url>
                <loc>${fullUrl}</loc>
                <lastmod>2024-01-15</lastmod>
                <changefreq>monthly</changefreq>
                <priority>${url === "" ? "1.0" : "0.8"}</priority>
            </url>
        `;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlSet}
    </urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
