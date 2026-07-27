import { Outlet } from "react-router";
import { PageTitle } from "../components/PageTitle";

export default function ServicesLayout() {
  return (
    <section>

      {/* Child routes render here */}
      <Outlet />
    </section>
  );
}
