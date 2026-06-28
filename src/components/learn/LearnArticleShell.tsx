import type { ReactNode } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Logo } from "@/components/Logo";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { LearnSupport } from "@/components/learn/LearnSupport";
import type { LearnCategoryId } from "@/lib/learn/categories";

type LearnArticleShellProps = {
  title: string;
  intro?: ReactNode;
  currentId?: LearnCategoryId;
  breadcrumbCategory?: string;
  breadcrumbCategoryPath?: `/learn/${string}`;
  breadcrumbArticle?: string;
  children: ReactNode;
};

export function LearnArticleShell({
  title,
  intro,
  breadcrumbCategory,
  breadcrumbCategoryPath,
  breadcrumbArticle,
  children,
}: LearnArticleShellProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Learn", href: "/learn" },
    ...(breadcrumbCategory && breadcrumbCategoryPath
      ? [{ label: breadcrumbCategory, href: breadcrumbCategoryPath }]
      : []),
    { label: breadcrumbArticle ?? title },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <LandingHeader />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-12 sm:pb-16 lg:pt-40">
          <LearnBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-navy-foreground max-w-4xl">{title}</h1>
          {intro ? (
            <div className="mt-4 text-base sm:text-lg text-navy-foreground/70 leading-relaxed max-w-3xl">{intro}</div>
          ) : null}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 space-y-10">
        {children}
        <LearnSupport />
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <Logo size="default" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VegaPal. Secure Payments &amp; Trusted Deals.
          </p>
        </div>
      </footer>
    </div>
  );
}
