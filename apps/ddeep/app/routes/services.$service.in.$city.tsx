// app/routes/services.$service.in.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";
import DynamicServicePage from "../components/landing/dynamic";
import { getSeoMeta } from "../utils/seo";

function formatCityName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Action 2 (P0) — shared programmatic content fix.
 *
 * The old description template hard-coded a "Professional " prefix and then
 * interpolated `heroTitle.toLowerCase()`. For services whose heroTitle already
 * begins with "Professional" (e.g. "Professional Office Cleaning") this
 * produced the duplicated-prefix bug seen across every city page:
 *   "Professional professional office cleaning in Bolton. ..."
 *
 * Fix: use the service heroTitle verbatim (it already carries the marketing
 * adjective) and drop the hard-coded prefix. This single change lifts every
 * {service} x {city} page at once.
 */
function buildDescription(
  heroTitle: string,
  heroSubtitle: string,
  cityName: string,
): string {
  const lead = `${heroTitle} in ${cityName}.`;
  const body = heroSubtitle.trim();
  const tail = `Fully insured, vetted cleaners. Book your free quote today.`;
  return [lead, body, tail].filter(Boolean).join(" ");
}

/**
 * Action 3 (P1) — on-page quality pass.
 *
 * Fallback title used ONLY for un-authored cities. It is deliberately short
 * (<= 60 chars), keyword-first, and NEVER the string "Not Found". The old
 * fallback leaked the literal "Not Found" into the rendered <title> for every
 * programmatic page, which is the exact defect Action 3 fixes.
 */
function buildFallbackTitle(heroTitle: string, cityName: string): string {
  const t = `${heroTitle} in ${cityName} | D DEEP`;
  return t.length > 60 ? `${heroTitle} ${cityName} | D DEEP` : t;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.service;
  const citySlug = params.city;

  if (!slug || !servicesContent[slug] || !citySlug) {
    throw new Response("Not Found", { status: 404 });
  }

  // Per-page (service x city) unique content. Missing entries fall back to
  // service-level defaults so the route never 404s on un-authored cities.
  const pageContent = cityContent[`${slug}:${citySlug}`] ?? null;

  return {
    slug,
    citySlug,
    cityName: formatCityName(citySlug),
    serviceData: servicesContent[slug],
    pageContent,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // The 404 branch is the ONLY place "Not Found" may appear, and it is a real
  // 404. Programmatic pages always resolve `data` and therefore never emit it.
  if (!data) return [{ title: "D DEEP Cleaning | Professional Cleaners" }];

  const { slug, citySlug, cityName, serviceData, pageContent } = data;

  // Title: prefer the per-page unique title from cityContent (already <= 60
  // chars and keyword-targeted). Fall back to a short, distinct, keyword-first
  // title — never the templated "Not Found" string.
  const title =
    pageContent?.title ?? buildFallbackTitle(serviceData.heroTitle, cityName);

  // Description: prefer the per-page unique meta description (de-duplicated,
  // 140-160 chars). Fall back to the shared builder which no longer duplicates
  // the "professional" prefix (Action 2).
  const description =
    pageContent?.metaDescription ??
    buildDescription(serviceData.heroTitle, serviceData.heroSubtitle, cityName);

  // Unique keyword set per page: primary first, then supporting long-tails.
  const keywords = pageContent
    ? [pageContent.primaryKeyword, ...pageContent.secondaryKeywords].join(", ")
    : undefined;

  return getSeoMeta({
    title,
    description,
    keywords,
    url: `https://www.ddeepcleaningservices.com/services/${slug}/in/${citySlug}/`,
  });
};

export default function CityServiceRoute() {
  const { serviceData, cityName, pageContent } = useLoaderData<typeof loader>();

  // Override the service data with per-page (service x city) content so the
  // shared template renders the UNIQUE H1, intro, service detail, local proof,
  // FAQs and CTA authored in cityContent.ts (Action 3 + Action 5).
  const merged = {
    ...serviceData,
    cityName,
    pageContent,
    // Unique H1 (keyword-targeted) when authored; template falls back otherwise.
    heroTitle: pageContent?.h1 ?? serviceData.heroTitle,
    // Unique intro copy replaces the templated subtitle for this city.
    heroSubtitle: pageContent?.intro ?? serviceData.heroSubtitle,
  };

  return <DynamicServicePage data={merged} />;
}
