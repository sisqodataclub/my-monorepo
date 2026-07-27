// react-router.config.ts
import { type Config } from "@react-router/dev/config";
import { servicesContent } from "./app/components/landing/servicesContent";
import { targetCities } from "./app/utils/locations";

export default {
  ssr: false,
  prerender: async () => {
    const serviceSlugs = Object.keys(servicesContent);

    // Core pages
    const coreRoutes = ["/"];

    // Standalone service pages (e.g., /services/deep-cleaning/)
    const serviceRoutes = serviceSlugs.map(slug => `/services/${slug}/`);

    // City hubs (e.g., /locations/manchester-city-centre/)
    const cityHubRoutes = targetCities.map(city => `/locations/${city}/`);

    // Hyper‑local service + city combinations with 'in' keyword (e.g., /services/deep-cleaning/in/manchester-city-centre/)
    const cityServiceRoutes: string[] = [];
    serviceSlugs.forEach(service => {
      targetCities.forEach(city => {
        cityServiceRoutes.push(`/services/${service}/in/${city}/`);
      });
    });

    return [
      ...coreRoutes,
      ...serviceRoutes,
      ...cityHubRoutes,
      ...cityServiceRoutes,
    ];
  },
} satisfies Config;
