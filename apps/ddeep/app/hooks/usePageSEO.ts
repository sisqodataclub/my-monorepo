import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  schema?: object;
}

export function usePageSEO({ title, description, keywords, schema }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    if (schema) {
      const scriptId = "seo-schema";
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.innerHTML = JSON.stringify(schema);
    }

    return () => {
      const script = document.getElementById("seo-schema");
      if (script) script.remove();
    };
  }, [title, description, keywords, schema]);
}
