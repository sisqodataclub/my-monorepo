import { type Config } from "@react-router/dev/config";
import { servicesContent } from "./app/components/landing/servicesContent";

export default {
  ssr: false,
  prerender: async () => {
    // Automatically generate all service routes with trailing slashes
    const serviceRoutes = Object.keys(servicesContent).map(
      (slug) => `/services/${slug}/`
    );

    return [
      "/", // Homepage
      ...serviceRoutes, // All current and future service pages
      // ❌ Excluded: "/tc" – it has noindex, no need to prerender it
    ];
  },
} satisfies Config;
