import { Link } from "@tanstack/react-router";

const INTERNAL_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Converter", href: "/#converter" },
  { label: "Register", to: "/register" as const },
  { label: "Contact", href: "/#contact" },
  { label: "FAQ", to: "/learn/faq" as const },
] as const;

export function LearnInternalLinks() {
  return (
    <section
      className="rounded-2xl border border-border bg-muted/20 p-6 sm:p-8"
      aria-labelledby="learn-internal-links"
    >
      <h2 id="learn-internal-links" className="text-lg font-semibold text-foreground">
        Explore VegaPal
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {INTERNAL_LINKS.map((link) => (
          <li key={link.label}>
            {"to" in link ? (
              <Link
                to={link.to}
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
