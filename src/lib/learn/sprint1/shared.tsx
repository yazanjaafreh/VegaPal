import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { LearnFaqItem, LearnRelatedArticle, LearnTocItem } from "@/lib/learn/types";

export type Sprint1ArticleConfig = {
  path: `/learn/${string}`;
  title: string;
  description: string;
  breadcrumbTitle: string;
  heroTitle: string;
  intro: string;
  toc: LearnTocItem[];
  faq: LearnFaqItem[];
  related: LearnRelatedArticle[];
};

export const SPRINT1_PATHS = [
  "/learn/what-is-an-invoice",
  "/learn/what-is-a-bill",
  "/learn/invoice-vs-bill",
  "/learn/invoice-generator",
  "/learn/invoice-software",
] as const;

export function sprint1RelatedArticles(current: (typeof SPRINT1_PATHS)[number]): LearnRelatedArticle[] {
  const all: LearnRelatedArticle[] = [
    { path: "/learn/what-is-an-invoice", title: "What is an Invoice?" },
    { path: "/learn/what-is-a-bill", title: "What is a Bill?" },
    { path: "/learn/invoice-vs-bill", title: "Invoice vs Bill" },
    { path: "/learn/invoice-generator", title: "Invoice Generator Guide" },
    { path: "/learn/invoice-software", title: "Invoice Software Guide" },
    { path: "/learn/invoice", title: "Professional Invoice & Bill Generator" },
    { path: "/learn/getting-started", title: "Getting Started with VegaPal" },
    { path: "/learn/faq", title: "VegaPal FAQ" },
  ];
  return all.filter((a) => a.path !== current);
}

export function LearnSection({
  id,
  title,
  level = 2,
  children,
}: {
  id: string;
  title: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  if (level === 3) {
    return (
      <section aria-labelledby={id}>
        <h3 id={id} className="!mt-6">
          {title}
        </h3>
        {children}
      </section>
    );
  }
  return (
    <section id={id} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <p key={text.slice(0, 48)}>{text}</p>
      ))}
    </>
  );
}

export function LearnInlineLink({ to, children }: { to: `/learn${string}`; children: ReactNode }) {
  return (
    <Link to={to} className="text-primary hover:underline font-medium">
      {children}
    </Link>
  );
}
