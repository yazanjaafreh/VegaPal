import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LearnRegisterCta() {
  return (
    <section
      className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6"
      aria-labelledby="learn-register-cta"
    >
      <div>
        <h2 id="learn-register-cta" className="text-xl font-bold tracking-tight text-foreground">
          Create your first invoice
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Register on VegaPal to build professional invoices, share payment links, and track paid and unpaid bills from
          one dashboard.
        </p>
      </div>
      <Button asChild variant="hero" size="lg" className="shrink-0 w-full sm:w-auto">
        <Link to="/register">
          Register <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
