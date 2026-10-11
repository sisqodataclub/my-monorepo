import type { Route } from "./+types/sitemap[.xml]";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";

// Action 1 (P0 indexation fix): the city list is now DERIVED from the same
// source of truth the programmatic route uses (servicesContent `cities`
// arrays) instead of a hardcoded array that could silently drift. This
// guarantees every service x city page the route can serve is also emitted
// in the sitemap, in the exact trailing-slash canonical form.
function slugifyCity(city: string) {
    return city.toLowerCase().replace(/\s+/g, "-");
}

function allCities(): string[] {
    const set = new Set<string>();
    for (const service of Object.values(servicesContent)) {
        for (const city of service.cities ?? []) {
            set.add(slugifyCity(city));
        }
    }
    // Any city that has authored per-city content must also be present.
    for (const key of Object.keys(cityContent)) {
        const citySlug = key.split(":")[1];
        if (citySlug) set.add(citySlug);
    }
    return Array.from(set).sort();
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
    const cities = allCities();
    for (const serviceSlug of Object.keys(servicesContent)) {
        const service = servicesContent[serviceSlug];
        const declaredCities = new Set((service.cities ?? []).map(slugifyCity));
        for (const citySlug of cities) {
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
