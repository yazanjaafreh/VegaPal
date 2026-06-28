import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LearnTocItem } from "@/lib/learn/types";
import { cn } from "@/lib/utils";

export function LearnCollapsibleToc({ items }: { items: LearnTocItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden rounded-xl border border-border bg-muted/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        aria-expanded={open}
        aria-controls="learn-mobile-toc"
      >
        Table of contents
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <nav id="learn-mobile-toc" className="border-t border-border px-4 py-3" aria-labelledby="learn-mobile-toc-heading">
          <ol className="space-y-2 text-sm list-decimal list-inside marker:text-primary">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-primary hover:underline" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}
