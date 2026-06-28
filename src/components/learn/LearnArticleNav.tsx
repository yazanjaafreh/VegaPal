import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LearnArticleNavLink } from "@/lib/learn/types";

type LearnArticleNavProps = {
  prev?: LearnArticleNavLink;
  next?: LearnArticleNavLink;
};

export function LearnArticleNav({ prev, next }: LearnArticleNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="grid sm:grid-cols-2 gap-4 border-t border-border pt-8"
      aria-label="Article navigation"
    >
      {prev ? (
        <Link
          to={prev.path}
          className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-soft transition-all"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Previous
          </span>
          <span className="mt-1 block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.path}
          className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-soft transition-all sm:text-right"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide sm:justify-end sm:w-full">
            Next
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="mt-1 block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
