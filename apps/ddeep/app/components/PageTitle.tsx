import { useEffect } from "react";

interface PageTitleProps {
  title: string;
  suffix?: string;
}

const DEFAULT_SUFFIX = "Professional Cleaning Services";

export function PageTitle({ title, suffix = DEFAULT_SUFFIX }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | ${suffix}`;
  }, [title, suffix]);

  return (
    <header className="page-header">
      <h1 className="page-heading">{title}</h1>
    </header>
  );
}
