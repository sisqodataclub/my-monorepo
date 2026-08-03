import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./app.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "D Deep Cleaning Services | Professional Cleaning in Manchester, Liverpool & Salford" },
    { name: "description", content: "Professional cleaning services in Manchester, Liverpool, Salford and the North West. End of tenancy cleaning, carpet cleaning, office cleaning and more. Contact us at clean@ddeepcleaningservices.com" },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: "https://www.ddeepcleaningservices.com/" },
    { property: "og:title", content: "D Deep Cleaning Services | Professional Cleaning in Manchester, Liverpool & Salford" },
    { property: "og:description", content: "Professional cleaning services in Manchester, Liverpool, Salford and the North West." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.ddeepcleaningservices.com/" },
    { property: "og:site_name", content: "D Deep Cleaning Services" },
  ];
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "D Deep Cleaning Services",
  "email": "clean@ddeepcleaningservices.com",
  "areaServed": ["Manchester", "Liverpool", "Salford", "North West"],
  "url": "https://www.ddeepcleaningservices.com/",
  "telephone": "",
  "priceRange": "££",
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
