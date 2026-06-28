import { createFileRoute } from "@tanstack/react-router";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Logo } from "@/components/Logo";
import {
  BookOpen,
  FileText,
  Wallet,
  ShieldCheck,
  Building2,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

const LEARN_CATEGORIES: Array<{
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Set up your VegaPal account, understand the dashboard, and send your first invoice in minutes.",
    icon: BookOpen,
  },
  {
    id: "invoice",
    title: "Invoice",
    description:
      "Create professional invoices, customize line items, currencies, and PDF exports for your clients.",
    icon: FileText,
  },
  {
    id: "payments",
    title: "Payments",
    description:
      "Accept USDT and other payment methods with shareable payment links and wallet-based checkout flows.",
    icon: Wallet,
  },
  {
    id: "security",
    title: "Security",
    description:
      "Learn how VegaPal protects your data, secures payment pages, and helps you run trusted business deals.",
    icon: ShieldCheck,
  },
  {
    id: "business",
    title: "Business",
    description:
      "Best practices for freelancers and teams managing recurring clients, subscriptions, and crypto billing.",
    icon: Building2,
  },
  {
    id: "faq",
    title: "FAQ",
    description:
      "Answers to common questions about USDT payments, invoices, wallets, networks, and account management.",
    icon: CircleHelp,
  },
];

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "VegaPal Learn | Invoice, USDT Payments & Crypto Billing Guides" },
      {
        name: "description",
        content:
          "Learn how invoices, USDT payments, payment links, wallet payments, and secure business payments work with VegaPal.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "VegaPal Learn | Invoice, USDT Payments & Crypto Billing Guides" },
      {
        property: "og:description",
        content:
          "Learn how invoices, USDT payments, payment links, wallet payments, and secure business payments work with VegaPal.",
      },
      { property: "og:url", content: "https://vega-pal.com/learn" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vega-pal.com/learn" }],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <LandingHeader />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-20 lg:pt-40">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Learn</p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-foreground max-w-3xl">
            Guides for invoices, USDT payments &amp; crypto billing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-navy-foreground/70 max-w-2xl leading-relaxed">
            Explore how VegaPal helps you create invoices, share payment links, accept wallet payments, and run secure
            business deals.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARN_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.id}
                id={category.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{category.description}</p>
              </article>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <Logo size="default" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} VegaPal. Secure Payments &amp; Trusted Deals.</p>
        </div>
      </footer>
    </div>
  );
}
