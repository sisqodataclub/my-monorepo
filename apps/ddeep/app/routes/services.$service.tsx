import { Navigate, useParams } from "react-router"; // ✅ react-router
import DynamicServicePage from "../components/landing/dynamic";
import { servicesContent } from "../components/landing/servicesContent";

export default function ServiceRoute() {
  const { service } = useParams<"service">(); // typed param

  if (!service || !servicesContent[service]) {
    return <Navigate to="/" replace />; // fallback
  }

  return <DynamicServicePage data={servicesContent[service]} />; // consistent prop name
}
