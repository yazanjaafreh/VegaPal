import { Link } from "@tanstack/react-router";
import type { LearnTocItem, LearnRelatedArticle } from "@/lib/learn/types";
import { LearnPopularSearches } from "@/components/learn/LearnPopularSearches";

type LearnArticleSidebarProps = {
  toc: LearnTocItem[];
  related: LearnRelatedArticle[];
};

export function LearnArticleSidebar({ toc, related }: LearnArticleSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-8 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
        <nav aria-labelledby="sidebar-toc-heading">
          <h2 id="sidebar-toc-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            On this page
          </h2>
          <ol className="mt-3 space-y-2 text-sm border-l border-border pl-3">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {related.length > 0 ? (
          <nav aria-labelledby="sidebar-related-heading">
            <h2 id="sidebar-related-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Related guides
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {related.slice(0, 5).map((article) => (
                <li key={article.path}>
                  <Link to={article.path} className="text-primary hover:underline leading-snug">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <LearnPopularSearches compact />
      </div>
    </aside>
  );
}
