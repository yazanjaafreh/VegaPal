import type { LearnTocItem } from "@/lib/learn/types";

export function LearnTableOfContents({ items }: { items: LearnTocItem[] }) {
  return (
    <nav
      className="rounded-2xl border border-border bg-muted/20 p-6"
      aria-labelledby="learn-toc-heading"
    >
      <h2 id="learn-toc-heading" className="text-lg font-semibold text-foreground">
        Table of contents
      </h2>
      <ol className="mt-4 space-y-2 text-sm list-decimal list-inside marker:text-primary">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-primary hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
