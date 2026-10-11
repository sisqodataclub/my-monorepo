// app/components/landing/InternalLinks.tsx
// Action 4 (P1) — contextual internal linking for programmatic service×city pages.
// Adds descriptive-anchor links to: related services, nearby cities, and the main service hub.
import { Link } from "react-router";
import { servicesContent } from "./servicesContent";

interface InternalLinksProps {
  serviceSlug: string;
  citySlug: string;
  cityName: string;
}

function serviceLabel(slug: string): string {
  const data = servicesContent[slug];
  if (!data) return slug.replace(/-/g, " ");
  return data.heroTitle.replace(/\s*Services?$/i, "").trim();
}

function cityLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function nearbyCities(serviceSlug: string, currentCitySlug: string, limit = 4): string[] {
  const data = servicesContent[serviceSlug];
  if (!data || !data.cities) return [];
  return data.cities
    .map((c) => c.toLowerCase().replace(/\s+/g, "-"))
    .filter((slug) => slug !== currentCitySlug)
    .slice(0, limit);
}

function relatedServices(currentSlug: string, limit = 4): string[] {
  return Object.keys(servicesContent)
    .filter((slug) => slug !== currentSlug)
    .slice(0, limit);
}

export default function InternalLinks({ serviceSlug, citySlug, cityName }: InternalLinksProps) {
  const currentServiceLabel = serviceLabel(serviceSlug);
  const cities = nearbyCities(serviceSlug, citySlug);
  const services = relatedServices(serviceSlug);

  return (
    <section className="w-full bg-white border-t border-slate-100 py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Other Cleaning Services</h2>
            <ul className="space-y-2 text-slate-600">
              {services.map((slug) => (
                <li key={slug}>
                  <Link to={`/services/${slug}/`} className="text-green-700 hover:text-green-600 underline underline-offset-4">
                    {serviceLabel(slug)} services
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services/" className="text-green-700 hover:text-green-600 underline underline-offset-4">
                  Browse all cleaning services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">{currentServiceLabel} in Nearby Areas</h2>
            {cities.length > 0 ? (
              <ul className="space-y-2 text-slate-600">
                {cities.map((slug) => (
                  <li key={slug}>
                    <Link to={`/services/${serviceSlug}/in/${slug}/`} className="text-green-700 hover:text-green-600 underline underline-offset-4">
                      {currentServiceLabel} in {cityLabel(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">We cover the whole North West — contact us for your area.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">About This Service</h2>
            <p className="text-slate-600 mb-4">
              Learn more about our {currentServiceLabel.toLowerCase()} offering or get a free quote for {cityName}.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link to={`/services/${serviceSlug}/`} className="text-green-700 hover:text-green-600 underline underline-offset-4">
                  {currentServiceLabel} service overview
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-green-700 hover:text-green-600 underline underline-offset-4">
                  Get a free {currentServiceLabel.toLowerCase()} quote
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
