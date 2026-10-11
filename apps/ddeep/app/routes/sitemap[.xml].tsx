import type { Route } from "./+types/sitemap[.xml]";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";

// Cities enumerated from the same source the programmatic route uses.
// Keep this list in sync with servicesContent.tsx `cities` arrays.
const CITIES = [
    "manchester",
    "liverpool",
    "salford",
    "warrington",
    "bolton",
    "stockport",
    "oldham",
];

function slugifyCity(city: string) {
    return city.toLowerCase().replace(/\s+/g, "-");
}

export async function loader({ request }: Route.LoaderArgs) {
    const baseUrl = "https://www.ddeepcleaningservices.com";

    const staticUrls = [
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

    // Enumerate every {service} x {city} pair in trailing-slash canonical form.
    // Only emit pairs that have an authored per-city entry OR are services that
    // declare city coverage, so we never submit thin/duplicate URLs.
    const programmaticUrls: string[] = [];
    for (const serviceSlug of Object.keys(servicesContent)) {
        const service = servicesContent[serviceSlug];
        const declaredCities = new Set((service.cities ?? []).map(slugifyCity));
        for (const citySlug of CITIES) {
            const authored = Boolean(cityContent[`${serviceSlug}:${citySlug}`]);
            const declared = declaredCities.has(citySlug);
            if (authored || declared) {
                programmaticUrls.push(
                    `/services/${serviceSlug}/in/${citySlug}/`
                );
            }
        }
    }

    const urls = [...staticUrls, ...programmaticUrls];

    const urlSet = urls
        .map((url) => {
            const fullUrl = `${baseUrl}${url}`;
            const isHome = url === "";
            const isProgrammatic = url.includes("/in/");
            const priority = isHome ? "1.0" : isProgrammatic ? "0.7" : "0.8";
            return `
            <url>
                <loc>${fullUrl}</loc>
                <lastmod>2026-10-11</lastmod>
                <changefreq>monthly</changefreq>
                <priority>${priority}</priority>
            </url>
        `;
        })
        .join("");

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
