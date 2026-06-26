import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { qrCodeToDataUrl } from "@/lib/qrcode-lazy";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, Zap, Globe2, ArrowRight, Check, FileText, BarChart3,
  Sparkles, Banknote, Menu, Mail, Headphones,
  Copy, AlertTriangle,
} from "lucide-react";
import type { TFunction } from "i18next";

const LiveCurrencyConverter = lazy(() =>
  import("@/components/landing/LiveCurrencyConverter").then((m) => ({
    default: m.LiveCurrencyConverter,
  })),
);

const DEMO_WALLET = "TUckRdnGxRY7VehPLfu5RLz6QspQ8T4Sj5";

const SUBSCRIPTION_WALLETS = [
  {
    network: "TRON TRC20",
    address: "TUckRdnGxRY7VehPLfu5RLz6QspQ8T4Sj5",
  },
  {
    network: "BNB Smart Chain BEP20",
    address: "0xFB597F1b4Cf04F4a60bA36730C08e9180Fd932c2",
  },
] as const;

type SubscriptionPlan = { planKey: "pro" | "business"; price: number };

const LANDING_NAV_LINKS = [
  { href: "#features", labelKey: "features" },
  { href: "#converter", labelKey: "converter" },
  { href: "#how", labelKey: "howItWorks" },
  { href: "#pricing", labelKey: "pricing" },
  { href: "#contact", labelKey: "contact" },
] as const;

const landingNavLinkClass = "hover:text-navy-foreground transition-colors";

function LandingHeader() {
  const { t: tc } = useTranslation("common");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <header className="absolute top-0 inset-x-0 z-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:pl-10 lg:pr-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        <Logo light size="hero" className="shrink-0 origin-left scale-[0.85] sm:scale-100" />
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-navy-foreground/70">
          {LANDING_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={landingNavLinkClass}>
              {tc(`nav.${link.labelKey}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher variant="landing" />
            <Button asChild variant="ghostLight" size="sm">
              <Link to="/login">{tc("nav.signIn")}</Link>
            </Button>
            <Button asChild variant="hero" size="sm" className="whitespace-nowrap">
              <Link to="/register">
                {tc("nav.getStarted")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher variant="landing" compact />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-foreground/70 transition-colors hover:text-navy-foreground hover:bg-white/5"
                  aria-label={tc("nav.openMenu")}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-white/10 bg-navy text-navy-foreground w-[min(100vw-2rem,20rem)] flex flex-col"
              >
                <nav className="mt-10 flex flex-col gap-5 text-base text-navy-foreground/70">
                  {LANDING_NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={landingNavLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      {tc(`nav.${link.labelKey}`)}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-3">
                  <Button asChild variant="ghostLight" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link to="/login">{tc("nav.signIn")}</Link>
                  </Button>
                  <Button asChild variant="hero" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link to="/register">
                      {tc("nav.getStarted")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function getSubscriptionNetworkLabel(network: string, t: TFunction<"landing">): string {
  if (network === "TRON TRC20") return t("subscriptionModal.networkTron");
  if (network === "BNB Smart Chain BEP20") return t("subscriptionModal.networkBep20");
  return network;
}

function PricingCard({
  name,
  description,
  price,
  features,
  cta,
  variant,
  popular = false,
  href,
  onCtaClick,
}: {
  name: string;
  description: string;
  price: number;
  features: string[];
  cta: string;
  variant: "outline" | "hero";
  popular?: boolean;
  href?: string;
  onCtaClick?: () => void;
}) {
  const { t: tc } = useTranslation("common");

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-8 flex flex-col relative",
        popular ? "border-2 border-primary shadow-elevated" : "border-border",
      )}
    >
      {popular && (
        <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {tc("popular")}
        </span>
      )}
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <p className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight">
        ${price}
        <span className="text-base text-muted-foreground font-medium">{tc("monthly")}</span>
      </p>
      <ul className="mt-6 space-y-3 text-sm flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {href ? (
        <Button asChild variant={variant} size="lg" className="mt-8 w-full">
          <Link to={href}>{cta}</Link>
        </Button>
      ) : (
        <Button type="button" variant={variant} size="lg" className="mt-8 w-full" onClick={onCtaClick}>
          {cta}
        </Button>
      )}
    </div>
  );
}

function PaymentQr({ value, className }: { value: string; className?: string }) {
  const { t: tc } = useTranslation("common");
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    qrCodeToDataUrl(value, { margin: 1, width: 168 })
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!src) {
    return <div className={cn("h-[132px] w-[132px] rounded-xl bg-muted animate-pulse shrink-0", className)} />;
  }

  return (
    <img
      src={src}
      alt={tc("qr.walletAlt")}
      className={cn("h-[132px] w-[132px] rounded-xl border border-border bg-white p-1.5 shrink-0", className)}
    />
  );
}

function CopyWalletButton({ address }: { address: string }) {
  const { t: tc } = useTranslation("common");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} className="gap-1.5">
      <Copy className="h-3.5 w-3.5" />
      {copied ? tc("buttons.copied") : tc("buttons.copyWallet")}
    </Button>
  );
}

function SubscriptionPaymentModal({
  plan,
  open,
  onOpenChange,
}: {
  plan: SubscriptionPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation("landing");
  const { t: tc } = useTranslation("common");

  if (!plan) return null;

  const planName = t(`pricing.plans.${plan.planKey}.name`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("subscriptionModal.title", { plan: planName })}</DialogTitle>
          <DialogDescription>{t("subscriptionModal.description")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{tc("labels.plan")}</p>
              <p className="font-semibold">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("subscriptionModal.amountLabel")}</p>
              <p className="text-2xl font-bold tabular-nums">
                ${plan.price} <span className="text-sm font-medium text-muted-foreground">{tc("usdtPerMonth")}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium">{t("subscriptionModal.paymentMethods")}</p>
          {SUBSCRIPTION_WALLETS.map((wallet) => (
            <div key={wallet.address} className="rounded-xl border border-border p-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{tc("labels.network")}</p>
                <p className="text-sm font-semibold">{getSubscriptionNetworkLabel(wallet.network, t)}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <PaymentQr value={wallet.address} />
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{tc("labels.walletAddress")}</p>
                    <p className="text-sm font-mono break-all leading-snug">{wallet.address}</p>
                  </div>
                  <CopyWalletButton address={wallet.address} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground leading-relaxed">
          {t("subscriptionModal.instructions")}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="flex-1">
            <a href="https://t.me/vegapal" target="_blank" rel="noopener noreferrer">
              <TelegramIcon className="h-4 w-4" />
              {t("subscriptionModal.telegram")}
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href="mailto:support@vegapal.com">
              <Mail className="h-4 w-4" />
              support@vegapal.com
            </a>
          </Button>
        </div>

        <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <p className="text-muted-foreground">{t("subscriptionModal.networkWarning")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.71a.2.2 0 0 0-.05-.18c-.05-.04-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.22-1.55-.4-.63-.21-1.13-.31-1.08-.66.02-.18.27-.36.92-.55 3.6-1.57 6.01-2.61 7.21-3.11 3.43-1.43 4.14-1.68 4.61-1.69.1 0 .33.02.48.14.12.1.16.24.17.34.01.1.03.32.01.49z" />
    </svg>
  );
}

function DemoPaymentQr({ value }: { value: string }) {
  return <PaymentQr value={value} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VegaPal — Secure USDT Invoices & Crypto Payments" },
      {
        name: "description",
        content:
          "Create professional USDT invoices and accept crypto payments. Built for freelancers and businesses who want secure, trusted deals.",
      },
      { property: "og:title", content: "VegaPal — Secure USDT Invoices" },
      {
        property: "og:description",
        content: "Professional crypto invoicing for freelancers and businesses.",
      },
      { property: "og:url", content: "https://vegapal.com/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://vegapal.com/" }],
  }),
  component: Landing,
});

function LandingStructuredData() {
  useEffect(() => {
    const id = "vegapal-ld-json";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "VegaPal",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Create professional USDT invoices and accept crypto payments.",
      url: "https://vegapal.com/",
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
  return null;
}

const FEATURE_ITEMS = [
  { icon: Zap, key: "fastPayments" },
  { icon: ShieldCheck, key: "directWallet" },
  { icon: Globe2, key: "multiplePayments" },
  { icon: FileText, key: "professionalInvoices" },
  { icon: BarChart3, key: "dashboard" },
  { icon: Sparkles, key: "trusted" },
] as const;

const HOW_IT_WORKS_STEPS = [
  { n: "01", key: "create" },
  { n: "02", key: "share" },
  { n: "03", key: "getPaid" },
] as const;

const FREE_PLAN_FEATURES = [
  "invoices", "pdf", "paymentPages", "payments", "dashboard", "branding",
  "qr", "excel", "reports", "multiCurrency", "footer",
] as const;

const PRO_PLAN_FEATURES = [
  "invoices", "users", "everythingFree", "prioritySupport", "earlyAccess", "footer",
] as const;

const BUSINESS_PLAN_FEATURES = [
  "invoices", "users", "everythingPro", "teamManagement", "multipleWallets",
  "analytics", "api", "prioritySupport", "footer",
] as const;

function Landing() {
  const { t } = useTranslation("landing");
  const { t: tc } = useTranslation("common");
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingStructuredData />
      <SubscriptionPaymentModal
        plan={subscriptionPlan}
        open={subscriptionPlan !== null}
        onOpenChange={(open) => {
          if (!open) setSubscriptionPlan(null);
        }}
      />
      <LandingHeader />

      {/* HERO */}
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24 lg:pt-44 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-navy-foreground min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-lg font-bold text-navy-foreground/85 mb-5 sm:mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
              {t("hero.badge")}
            </div>
            <h1 className="text-[1.75rem] leading-[1.15] sm:text-4xl lg:text-[3.35rem] font-bold tracking-tight text-balance text-navy-foreground">
              <span className="block">{t("hero.headlineLine1")}</span>
              <span className="block mt-2 lg:mt-3">
                {t("hero.headlineLine2Prefix")}{" "}
                <span className="text-primary text-[1.05em] sm:text-[1.1em]">{t("hero.headlineLine2Highlight")}</span>{" "}
                {t("hero.headlineLine2Suffix")}
              </span>
              <span className="block mt-2 lg:mt-3">{t("hero.headlineLine3")}</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-navy-foreground/70 max-w-xl leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                <Link to="/register">
                  {t("hero.createFirstInvoice")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghostLight" size="xl" className="w-full sm:w-auto">
                <a href="#demo-invoice">{t("hero.viewDemoInvoice")}</a>
              </Button>
            </div>
            <ul className="mt-8 sm:mt-10 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3 text-sm text-navy-foreground/70">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                {t("hero.features.pdfInvoices")}
              </li>
              <li className="flex items-center gap-2 font-semibold text-navy-foreground">
                <Banknote className="h-4 w-4 text-primary shrink-0" />
                {t("hero.features.paymentMethods")}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                {t("hero.features.verifiedPages")}
              </li>
            </ul>
          </div>

          {/* Mock invoice card */}
          <div id="demo-invoice" className="relative scroll-mt-24 sm:scroll-mt-28 w-full min-w-0 max-w-full">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-2xl bg-background shadow-elevated border border-border overflow-hidden w-full">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive/70" />
                  <div className="h-2 w-2 rounded-full bg-warning/70" />
                  <div className="h-2 w-2 rounded-full bg-success/70" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">INV-0042</span>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("hero.demo.billedTo")}</p>
                    <p className="font-semibold">{t("hero.demo.clientName")}</p>
                    <p className="text-sm text-muted-foreground break-all">{t("hero.demo.clientEmail")}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/15 text-success text-xs sm:text-sm font-semibold ring-1 ring-success/25 self-start shrink-0">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    {t("hero.demo.paid")}
                  </span>
                </div>
                <p className="text-sm text-[#111827] font-semibold mb-2">
                  {t("hero.demo.title")}
                </p>
                <p className="text-[1.75rem] sm:text-[2.75rem] lg:text-5xl font-bold tracking-tight tabular-nums leading-none break-all sm:break-normal">
                  200,000.00{" "}
                  <span className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-semibold">USDT</span>
                </p>
                <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    {t("hero.demo.cryptoPayment")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <DemoPaymentQr value={DEMO_WALLET} />
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{tc("labels.network")}</p>
                        <p className="text-sm font-medium">{t("hero.demo.networkTron")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{tc("labels.walletAddress")}</p>
                        <p className="text-sm font-mono break-all leading-snug">{DEMO_WALLET}</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {tc("buttons.copyWallet")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div
              id="converter"
              className="border-t border-white/5 bg-navy/40 py-14 lg:py-20 min-h-[320px] animate-pulse"
              aria-hidden
            />
          }
        >
          <LiveCurrencyConverter />
        </Suspense>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{t("features.eyebrow")}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {FEATURE_ITEMS.map((f) => (
              <div key={f.key} className="rounded-2xl border border-border bg-card p-6 hover:shadow-elevated transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{t(`features.items.${f.key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`features.items.${f.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{t("howItWorks.eyebrow")}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("howItWorks.title")}</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-background border border-border p-7">
                <span className="text-primary font-mono text-sm font-semibold">{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold">{t(`howItWorks.steps.${s.key}`)}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{t("pricing.eyebrow")}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("pricing.title")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="mt-14 grid lg:grid-cols-3 gap-6">
            <PricingCard
              name={t("pricing.plans.free.name")}
              description={t("pricing.plans.free.description")}
              price={0}
              features={FREE_PLAN_FEATURES.map((key) => t(`pricing.plans.free.features.${key}`))}
              cta={t("pricing.plans.free.cta")}
              variant="outline"
              href="/register"
            />
            <PricingCard
              name={t("pricing.plans.pro.name")}
              description={t("pricing.plans.pro.description")}
              price={19}
              popular
              features={PRO_PLAN_FEATURES.map((key) => t(`pricing.plans.pro.features.${key}`))}
              cta={t("pricing.plans.pro.cta")}
              variant="hero"
              onCtaClick={() => setSubscriptionPlan({ planKey: "pro", price: 19 })}
            />
            <PricingCard
              name={t("pricing.plans.business.name")}
              description={t("pricing.plans.business.description")}
              price={49}
              features={BUSINESS_PLAN_FEATURES.map((key) => t(`pricing.plans.business.features.${key}`))}
              cta={t("pricing.plans.business.cta")}
              variant="outline"
              onCtaClick={() => setSubscriptionPlan({ planKey: "business", price: 49 })}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-hero relative overflow-hidden p-6 sm:p-10 lg:p-16 text-navy-foreground">
            <div className="absolute inset-0 bg-mesh opacity-60" />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-xl text-balance">
                  {t("cta.title")}
                </h2>
                <p className="mt-3 text-navy-foreground/70 max-w-lg">
                  {t("cta.subtitle")}
                </p>
              </div>
              <Button asChild variant="hero" size="xl" className="w-full sm:w-auto shrink-0">
                <Link to="/register">
                  {t("cta.button")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-24 bg-hero overflow-hidden scroll-mt-28">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{t("contact.eyebrow")}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-navy-foreground">{t("contact.title")}</h2>
            <p className="mt-4 text-lg text-navy-foreground/70">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <a
              href="mailto:support@vegapal.com"
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-navy-foreground">{t("contact.email.title")}</h3>
              <p className="mt-2 text-sm text-primary group-hover:underline">support@vegapal.com</p>
            </a>

            <a
              href="https://t.me/vegapal"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                <TelegramIcon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-navy-foreground">{t("contact.telegram.title")}</h3>
              <p className="mt-2 text-sm text-navy-foreground/70 group-hover:text-navy-foreground transition-colors">
                {t("contact.telegram.description")}
              </p>
            </a>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-navy-foreground">{t("contact.liveSupport.title")}</h3>
              <p className="mt-2 text-sm text-navy-foreground/70">
                {t("contact.liveSupport.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <Logo />
          <p className="text-sm text-muted-foreground">
            {tc("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
