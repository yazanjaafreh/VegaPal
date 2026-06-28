import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Logo } from "@/components/Logo";
import { LearnRelatedLinks } from "@/components/learn/LearnRelatedLinks";
import { LearnSupport } from "@/components/learn/LearnSupport";
import { LEARN_BASE_URL, LEARN_CATEGORIES } from "@/lib/learn/categories";

const TITLE = "VegaPal Learn | Invoice, USDT Payments & Crypto Billing Guides";
const DESCRIPTION =
  "Learn how invoices, USDT payments, payment links, wallet payments, and secure business payments work with VegaPal.";

export const Route = createFileRoute("/learn")({
  head: () => {
    const url = `${LEARN_BASE_URL}/learn`;
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Learn VegaPal",
      description: DESCRIPTION,
      url,
    };

    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: DESCRIPTION },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(collectionLd) }],
    };
  },
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <LandingHeader />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20 lg:pt-40">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-foreground max-w-4xl">
            Learn VegaPal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/80 max-w-3xl leading-relaxed">
            Professional guides for invoices, billing, USDT payments, crypto payments, bank transfers and secure
            business invoicing.
          </p>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/70 max-w-3xl leading-relaxed">
            Learn everything about online invoicing, professional billing, secure payments, payment links, crypto
            invoices, bank transfer invoices and business payments. Whether you are a freelancer, startup or enterprise,
            VegaPal helps you create invoices in seconds and receive payments securely.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16 space-y-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARN_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <Link to={category.path} className="block group">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{category.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary">Read guide →</span>
                </Link>
              </article>
            );
          })}
        </div>

        <LearnSupport />
        <LearnRelatedLinks />
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
