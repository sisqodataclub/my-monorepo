import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollRestoration, Scripts, Links, Meta, Outlet } from "react-router";
import appStylesHref from "./app.css?url";

/** -------------------------
 * Root Layout
 * ------------------------- */
export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="stylesheet" href={appStylesHref} />
      </head>

      {/* 👇 KEY FIX */}
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Navbar />

        {/* 👇 This forces footer down */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>


        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
