import { useEffect } from "react";

interface PageTitleProps {
  title: string;
  suffix?: string;
  /** Heading level to render. Defaults to h1 so existing pages are unchanged. */
  level?: "h1" | "h2" | "h3";
}

const DEFAULT_SUFFIX = "Professional Cleaning Services";

export function PageTitle({ title, suffix = DEFAULT_SUFFIX, level = "h1" }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | ${suffix}`;
  }, [title, suffix]);

  const Heading = level as keyof JSX.IntrinsicElements;

  return (
    <header className="page-header">
      <Heading className="page-heading">{title}</Heading>
    </header>
  );
}
