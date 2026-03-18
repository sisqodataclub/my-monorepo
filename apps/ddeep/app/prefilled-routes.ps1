Write-Host "Creating reusable route skeletons..."

$routes = @{
  "_index.tsx" = @'
import { PageTitle } from "../root";

export const meta = () => [
  { title: "Home" },
  { name: "description", content: "Home page" },
];

export default function Home() {
  return (
    <section className="page-container">
      <PageTitle title="Home" />
    </section>
  );
}
'@

  "services.tsx" = @'
import { Outlet } from "react-router";

export default function ServicesLayout() {
  return <Outlet />;
}
'@

  "services._index.tsx" = @'
import { PageTitle } from "../root";

export const meta = () => [
  { title: "Services" }
];

export default function Services() {
  return (
    <section className="page-container">
      <PageTitle title="Our Services" />
    </section>
  );
}
'@

  "services.deep-clean.tsx" = @'
import { PageTitle } from "../root";

export const meta = () => [
  { title: "Deep Cleaning" }
];

export default function DeepClean() {
  return (
    <section className="page-container">
      <PageTitle title="Deep Cleaning" />
    </section>
  );
}
'@

  "services.regular.tsx" = @'
import { PageTitle } from "../root";

export const meta = () => [
  { title: "Regular Cleaning" }
];

export default function RegularCleaning() {
  return (
    <section className="page-container">
      <PageTitle title="Regular Cleaning" />
    </section>
  );
}
'@

  "tc.tsx" = @'
import { PageTitle } from "../root";

export const meta = () => [
  { title: "Terms & Conditions" }
];

export default function Terms() {
  return (
    <section className="page-container">
      <PageTitle title="Terms & Conditions" />
    </section>
  );
}
'@
}

New-Item -ItemType Directory -Force -Path routes | Out-Null

foreach ($file in $routes.Keys) {
  $routes[$file] | Set-Content "routes/$file" -Encoding UTF8
}

Write-Host "✅ Routes created successfully"
