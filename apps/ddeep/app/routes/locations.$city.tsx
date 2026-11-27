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

      {/* Dynamic Sections (per-city long-form content) — distinct premium treatments per section */}
      {pageContent?.dynamicSections && Object.keys(pageContent.dynamicSections).length > 0 ? (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="space-y-12">
            {(() => {
              const ds = pageContent.dynamicSections as Record<string, string | undefined>;

              // --- Our Story: premium prose card with gradient header + accent border ---
              const story = typeof ds.story === 'string' ? ds.story.trim() : '';
              const storyBlock = story ? (
                <article
                  key="story"
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_-15px_rgba(15,23,42,0.15)]"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                  <div className="px-6 py-10 sm:px-12 sm:py-14">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                      Our Story
                    </span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      Why {cityName}
                    </h2>
                    <div className="mt-6 border-l-4 border-emerald-500/70 pl-5 sm:pl-6">
                      <p className="text-lg sm:text-xl leading-loose text-slate-700">{story}</p>
                    </div>
                  </div>
                </article>
              ) : null;

              // --- Our Process: numbered steps ---
              const processRaw = typeof ds.process === 'string' ? ds.process.trim() : '';
              const processSteps = processRaw
                ? processRaw
                    .split(/(?<=[.!?])\s+/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                : [];
              const processBlock = processSteps.length > 0 ? (
                <article key="process" className="rounded-3xl bg-slate-900 px-6 py-10 sm:px-12 sm:py-14 text-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.5)]">
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Our Process
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                    How we work in {cityName}
                  </h2>
                  <ol className="mt-8 space-y-5">
                    {processSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-slate-900">
                          {i + 1}
                        </span>
                        <p className="text-base sm:text-lg leading-relaxed text-slate-200">{step}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              ) : null;

              // --- Areas We Serve: chips / pills ---
              const areasRaw = typeof ds.areas === 'string' ? ds.areas.trim() : '';
              const areasList = areasRaw
                ? areasRaw
                    .split(/[,;]|\s+and\s+/i)
                    .map((a) => a.trim())
                    .filter((a) => a.length > 0 && a.length < 60)
                : [];
              const areasBlock = areasList.length > 0 ? (
                <article key="areas" className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-10 sm:px-12 sm:py-14">
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Areas We Serve
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Postcodes we cover
                  </h2>
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {areasList.map((area, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
                      >
                        <FaMapMarkerAlt className="mr-2 h-3 w-3 text-emerald-500" />
                        {area}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null;

              // --- What Clients Say: testimonial cards ---
              const reviewsRaw = typeof ds.reviews === 'string' ? ds.reviews.trim() : '';
              const reviewQuotes = reviewsRaw
                ? reviewsRaw
                    .split(/(?<=[.!?])\s+/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 25)
                    .slice(0, 4)
                : [];
              const reviewsBlock = reviewQuotes.length > 0 ? (
                <article key="reviews">
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                    What Clients Say
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Reviews from {cityName}
                  </h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {reviewQuotes.map((quote, i) => (
                      <figure
                        key={i}
                        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]"
                      >
                        <span className="absolute -top-3 left-6 text-5xl font-black leading-none text-emerald-500/30 select-none">
                          &ldquo;
                        </span>
                        <blockquote className="mt-4">
                          <p className="text-base italic leading-relaxed text-slate-700">{quote}</p>
                        </blockquote>
                        <figcaption className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                          <span className="h-1 w-6 rounded-full bg-emerald-500" />
                          Verified {cityName} client
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </article>
              ) : null;

              return [storyBlock, processBlock, areasBlock, reviewsBlock];
            })()}
          </div>
        </section>
      ) : null}

      {/* Services Grid (merged: city-specific localDescription per card) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            What We Clean in {cityName}
          </h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Local detail on how each of our services adapts to {cityName} homes and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {availableServices.map((service, idx) => {
            const localDescription = pageContent?.serviceBlurbs?.[service.slug] ?? service.description;
            return (
              <Link
                key={idx}
                to={(citySlug === 'manchester' || citySlug === 'stockport') ? `/services/${service.slug}/in/${citySlug}/` : `/services/${service.slug}/`}
                className="group relative flex flex-col min-h-[44px] bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 ring-1 ring-transparent shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-green-200 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_18px_40px_-16px_rgba(22,163,74,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center mb-5 ring-1 ring-green-100">
                  <FaCheckCircle className="text-green-600 text-lg" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 mb-2.5 group-hover:text-green-700 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-[15px] text-slate-500 mb-6 flex-grow leading-relaxed">{localDescription}</p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 pt-4 border-t border-slate-100">
                  View Service <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Map Embed */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden">
          <iframe
            title={`Google Maps location for ${cityName} service area — 48A Gill St, Manchester M9 4FZ`}
            src="https://maps.google.com/maps?q=48A+Gill+St,+Manchester+M9+4FZ&z=15&output=embed"
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="w-full rounded-2xl"
          />
        </div>
      </section>

      <HomeFAQ faqs={pageContent.faqs} />

      {/* Visible NAP Block */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-black mb-4">Contact D DEEP Cleaning Services — {cityName}</h2>
          <ul className="space-y-2 text-slate-200">
            <li><span className="font-semibold text-white">Business:</span> {businessName}</li>
            <li><span className="font-semibold text-white">Phone:</span> <a href={`tel:${businessPhone}`} className="text-green-400 hover:underline">{businessPhone}</a></li>
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
