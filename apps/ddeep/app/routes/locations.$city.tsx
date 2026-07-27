// app/routes/locations.$city.tsx
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, Link } from "react-router";
import { servicesContent } from "../components/landing/servicesContent";
import { getSeoMeta } from "../utils/seo";
import HomeCTA from "../components/home/HomeCTA";
import HomeReviews from "../components/home/HomeReviews";
import { FaArrowRight, FaMapMarkerAlt, FaShieldAlt, FaLeaf, FaCertificate, FaCheckCircle } from "react-icons/fa";
import HeroImage from "../assets/bg.jpg";

function formatCityName(slug: string) {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const citySlug = params.city;
  if (!citySlug) throw new Response("Not Found", { status: 404 });
  const cityName = formatCityName(citySlug);

  const availableServices = Object.entries(servicesContent).map(([slug, data]) => ({
    slug,
    title: data.heroTitle,
    description: data.heroSubtitle,
  }));

  return { citySlug, cityName, availableServices };
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
  const { cityName, citySlug, availableServices } = useLoaderData<typeof loader>();

  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Cleaning Services in ${cityName} | D DEEP Cleaning Services`,
    description: `Expert domestic and commercial cleaning services in ${cityName}. Fully vetted professionals.`,
    url: `https://www.ddeepcleaningservices.com/locations/${citySlug}/`,
    provider: {
      "@type": "LocalBusiness",
      name: "D DEEP Cleaning Services",
      url: "https://www.ddeepcleaningservices.com",
      telephone: "07459416262",
      address: {
        "@type": "PostalAddress",
        addressRegion: "North West",
        addressCountry: "GB",
      },
    },
  };

  return (
    <main className="w-full bg-slate-50 min-h-screen">
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

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
            Choose from our 5-star rated domestic and commercial cleaning solutions across {cityName}. Fully vetted professionals delivering exceptional results.
          </p>
        </div>
      </section>

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
              <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-wider text-sm mt-auto">
                View Service <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 bg-white">
        <HomeReviews />
      </section>

      {/* Final Call to Action */}
      <section className="bg-green-950 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <HomeCTA />
        </div>
      </section>
    </main>
  );
}
