import { Link } from "@tanstack/react-router";
import { LEARN_POPULAR_SEARCHES } from "@/lib/learn/popular-searches";

type LearnPopularSearchesProps = {
  compact?: boolean;
};

export function LearnPopularSearches({ compact = false }: LearnPopularSearchesProps) {
  return (
    <section aria-labelledby={compact ? undefined : "popular-searches"}>
      {!compact ? (
        <>
          <h2 id="popular-searches" className="text-2xl font-bold tracking-tight text-foreground">
            Popular Searches
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Quick links to the most searched billing and payment topics.
          </p>
        </>
      ) : (
        <h3 className="text-sm font-semibold text-foreground">Popular searches</h3>
      )}
      <div className={compact ? "mt-3 flex flex-wrap gap-2" : "mt-5 flex flex-wrap gap-2"}>
        {LEARN_POPULAR_SEARCHES.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
