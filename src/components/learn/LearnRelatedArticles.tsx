import { Link } from "@tanstack/react-router";
import type { LearnRelatedArticle } from "@/lib/learn/types";

export function LearnRelatedArticles({ items }: { items: LearnRelatedArticle[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="learn-related-articles">
      <h2 id="learn-related-articles" className="text-lg font-semibold text-foreground">
        Related articles
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((article) => (
          <li key={article.path}>
            <Link to={article.path} className="text-primary hover:underline">
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
