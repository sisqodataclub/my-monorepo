// app/routes/locations.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { cityContent } from "../components/landing/cityContent";
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
    description: `Expert domestic and commercial cleaning services in ${data.cityName}. From end of tenancy to deep cleaning and office cleaning. Fully vetted professionals. Book today.`,
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
    description: `Expert domestic and commercial cleaning services in ${cityName}. Fully vetted professionals.`,
    url: `https://www.ddeepcleaningservices.com/locations/${citySlug}/`,
    provider: {
      "@type": "LocalBusiness",
      name: businessName,
      url: businessUrl,
      telephone: businessPhone,
      address: {
        "@type": "PostalAddress",
        ...businessAddress,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.ddeepcleaningservices.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Locations",
        item: "https://www.ddeepcleaningservices.com/locations/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: `https://www.ddeepcleaningservices.com/locations/${citySlug}/`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Cleaning service",
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    provider: {
      "@type": "LocalBusiness",
      name: businessName,
      url: businessUrl,
      telephone: businessPhone,
      address: {
        "@type": "PostalAddress",
        ...businessAddress,
      },
    },
    url: `https://www.ddeepcleaningservices.com/locations/${citySlug}/`,
  };

  const faqSchema = pageContent?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pageContent.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <main className="w-full bg-slate-50 min-h-screen">
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Enhanced Hero Section */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HeroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
              <span className="text-green-400"><FaShieldAlt /></span> Fully Insured
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
              <span className="text-green-400"><FaLeaf /></span> Eco-Friendly
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase">
              <span className="text-green-400"><FaCertificate /></span> Vetted Pros
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/30 border border-green-500/30 text-green-300 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            <FaMapMarkerAlt /> Local Coverage: {cityName}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-md">
            Professional Cleaning Services in <span className="text-green-400">{cityName}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-100 max-w-2xl font-medium">
            {pageContent?.intro ?? `Choose from our 5-star rated domestic and commercial cleaning solutions across ${cityName}. Fully vetted professionals delivering exceptional results.`}
          </p>
        </div>
      </section>

      {/* Local Coverage Details (per-city content) */}
      {pageContent && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pageContent.areas?.length ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-4">Areas We Cover in {cityName}</h2>
                <ul className="flex flex-wrap gap-2">
                  {pageContent.areas.map((area, idx) => (
                    <li key={idx} className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {pageContent.landmarks?.length ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-4">Local Landmarks We Serve</h2>
                <ul className="flex flex-wrap gap-2">
                  {pageContent.landmarks.map((landmark, idx) => (
                    <li key={idx} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {pageContent.coverageNote ? (
            <p className="mt-8 text-slate-600 text-lg max-w-3xl">{pageContent.coverageNote}</p>
          ) : null}
        </section>
      )}

      {/* Services Listing Section with Header */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Our Cleaning Services in {cityName}
          </h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of specialized cleaning solutions tailored for homes and businesses in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableServices.map((service, idx) => (
            <Link
              key={idx}
              to={`/services/${service.slug}/in/${citySlug}/`}
              className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 mb-8 flex-grow">{service.description}</p>
              <div className="inline-flex items-center gap-2 text-green-600 font-bold">
                View Service <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Service Blurbs (per-city, data-driven) */}
      {pageContent?.serviceBlurbs && Object.keys(pageContent.serviceBlurbs).length > 0 && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              What We Clean in {cityName}
            </h2>
            <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-4" />
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Local detail on how each of our services adapts to {cityName} homes and businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(pageContent.serviceBlurbs).map(([slug, blurb]) => {
              const title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              return (
                <div key={slug} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{blurb}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Map Embed */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden">
          {/* TODO(MAP): replace src with the real Google Maps embed URL for the {cityName} service area */}
          <div className="w-full h-[400px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-center px-6">
            <div>
              <p className="font-bold text-slate-700 mb-2">Map placeholder — {cityName} service area</p>
              <p className="text-sm">TODO(MAP): insert Google Maps iframe embed URL here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visible NAP Block */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-black mb-4">Contact D DEEP Cleaning Services — {cityName}</h2>
          <ul className="space-y-2 text-slate-200">
            <li><span className="font-semibold text-white">Business:</span> {businessName}</li>
            <li><span className="font-semibold text-white">Phone:</span> <a href={`tel:${businessPhone}`} className="text-green-400 hover:underline">{businessPhone}</a></li>
            {/* TODO(NAP): replace placeholder address with the real registered address */}
            <li><span className="font-semibold text-white">Address:</span> {businessAddress.streetAddress}, {businessAddress.addressLocality}, {businessAddress.postalCode}, {businessAddress.addressRegion}, {businessAddress.addressCountry}</li>
          </ul>
        </div>
      </section>

      <HomeReviews />
      <HomeGallery />
      <HomeCTA />
    </main>
  );
}
