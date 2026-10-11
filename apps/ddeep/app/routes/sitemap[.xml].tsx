// The /sitemap.xml URL is served from the static public/sitemap.xml file
// produced at build time by the closeBundle plugin in vite.config.ts.
// This route file is kept only so the URL still resolves; it renders nothing.
export default function Sitemap() {
    return null;
}
