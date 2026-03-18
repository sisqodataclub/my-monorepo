// react-router.config.ts
import { type Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: [
    "/", // Homepage
    "/services/regular-cleaning",
    "/services/deep-cleaning",
    "/services/end-of-tenancy-cleaning",
    "/services/appliances-cleaning",
    "/services/carpet-cleaning",
    "/services/office-cleaning",
    "/services/bars-restaurants",
    "/services/post-construction",
    "/services/healthcare-cleaning",
    "/services/student-accommodation",
    "/tc", // Terms & Conditions or other static page
  ],
} satisfies Config;
