import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),  // ✅ Tailwind plugin
    reactRouter(),  // ✅ React Router plugin
    tsconfigPaths() // ✅ Optional: path aliases from tsconfig.json
  ],
});
