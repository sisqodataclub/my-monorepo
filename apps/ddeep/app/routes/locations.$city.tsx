// app/routes/locations.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link, redirect } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";
import { targetCities } from "../utils/locations";
import { getSeoMeta } from "../utils/seo";
import HomeCTA from "../components/home/HomeCTA";
import HomeReviews from "../components/home/HomeReviews";
import HomeGallery from "../components/home/HomeGallery"; // ✅ 1. Imported HomeGallery
import { HomeFAQ } from "../components/HomeFAQ";
import { FaArrowRight, FaMapMarkerAlt, FaShieldAlt, FaLeaf, FaCertificate, FaCheckCircle } from "react-icons/fa";
import HeroImage from "../assets/bg.jpg";

function formatCityName(slug: string) {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const citySlug = params.city;
  if (!citySlug) throw new Response("Not Found", { status: 404 });

  // Retired city hub -> permanent 301 to /locations/manchester.
  // Only the 15 active targetCities keep a live /locations/<city>/ page.
  if (!targetCities.includes(citySlug)) {
    throw redirect("/locations/manchester", { status: 301 });
  }

  const cityName = formatCityName(citySlug);

  const pageContent = cityContent[citySlug] ?? null;

  const availableServices = Object.entries(servicesContent).map(([slug, data]) => ({
    slug,
    title: data.heroTitle,
    description: data.heroSubtitle,
  }));

  return { citySlug, cityName, availableServices, pageContent };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Not Found | D DEEP Cleaning" }];
  return getSeoMeta({
    title: `Cleaning Services in ${data.cityName} | 5★ D DEEP`,
    description: `Looking for trusted cleaners in ${data.cityName}? D DEEP delivers 5-star end of tenancy, deep and office cleaning with vetted, insured local teams. Get a fast quote.`,
    url: `https://www.ddeepcleaningservices.com/locations/${data.citySlug}/`,
  });
};

export default function LocationHub() {
  const { cityName, citySlug, availableServices, pageContent } = useLoaderData<typeof loader>();

  const businessAddress = {
    streetAddress: "48a Gill Street",
    addressLocality: "Manchester",
    postalCode: "M9 4FZ",
    addressRegion: "North West",
    addressCountry: "GB",
  };

  const businessName = "D DEEP Cleaning Services";
  const businessPhone = "07459416262";
  const businessUrl = "https://www.ddeepcleaningservices.com";

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Cleaning Services in ${cityName} | D DEEP Cleaning Services`,
    description: `Expert domestic and commercial cleaning services in ${cityName}. Fully vetted, insured professionals with local teams across ${cityName}.`,
    url: `https://www.ddeepcleaningservices.com/locations/${citySlug}/`,
    about: { "@type": "Thing", name: `Cleaning services in ${cityName}` },
    provider: {
      "@type": "LocalBusiness",
      name: businessName,
      url: businessUrl,
      telephone: businessPhone,
      address: { "@type": "PostalAddress", ...businessAddress },
    },
  };

  return (
    <main className="w-full bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      {/* rest of the page unchanged from main */}
      <HomeGallery />
      <HomeCTA />
    </main>
  );
}
