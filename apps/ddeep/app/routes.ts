// app/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  // 1. Explicitly define your dynamic service routes with unique configuration
  route("services/:service/in/:city", "routes/services.$service.in.$city.tsx"),
  route("services/:service", "routes/services.$service.tsx"),

  // 2. Pull in the rest of file-based routing, but filter out the entire services directory 
  // so flatRoutes() doesn't try to parse files inside it and cause duplicate IDs.
  ...(await flatRoutes()).filter(
    (r) => !r.path?.startsWith("services") && !r.file?.includes("services.")
  ),
] satisfies RouteConfig;
