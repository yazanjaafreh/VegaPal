import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { formatLearnDate } from "@/lib/learn/registry";
import type { LearnArticleMeta } from "@/lib/learn/types";

type LearnLatestArticlesProps = {
  articles: LearnArticleMeta[];
};

export function LearnLatestArticles({ articles }: LearnLatestArticlesProps) {
  return (
    <section aria-labelledby="latest-articles">
      <h2 id="latest-articles" className="text-2xl font-bold tracking-tight text-foreground">
        Latest Articles
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
        New and recently updated guides from the VegaPal knowledge center.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <article
            key={article.path}
            className="rounded-xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
          >
            <Link to={article.path} className="block group">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{article.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readingMinutes} min read
                </span>
                <time dateTime={article.publishedAt}>{formatLearnDate(article.publishedAt)}</time>
              </div>
              <span className="mt-3 inline-block text-sm font-medium text-primary">Read guide →</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
