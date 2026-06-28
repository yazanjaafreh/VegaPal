import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchLearnArticles } from "@/lib/learn/registry";

export function LearnKnowledgeSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchLearnArticles(query), [query]);
  const showResults = query.trim().length > 0;

  return (
    <section
      className="relative z-10 mx-auto max-w-3xl -mb-8 sm:-mb-10 px-4 sm:px-0"
      aria-labelledby="learn-search-heading"
    >
      <div className="rounded-2xl border border-border bg-card shadow-elevated p-6 sm:p-8">
        <h2 id="learn-search-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Search the VegaPal Knowledge Center
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Search articles about invoices, billing, USDT payments, payment links, bank transfers and crypto payments.
        </p>
        <div className="relative mt-5">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices, bills, USDT, bank transfer..."
            className="pl-10 h-11"
            aria-label="Search knowledge center articles"
            aria-controls="learn-search-results"
            aria-expanded={showResults}
          />
        </div>
        {showResults ? (
          <ul id="learn-search-results" className="mt-4 space-y-2 border-t border-border pt-4" role="listbox">
            {results.length > 0 ? (
              results.map((article) => (
                <li key={article.path} role="option">
                  <Link
                    to={article.path}
                    className="block rounded-lg px-3 py-2 hover:bg-muted/60 transition-colors"
                    onClick={() => setQuery("")}
                  >
                    <span className="font-medium text-foreground">{article.title}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.description}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">No articles match your search.</li>
            )}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
