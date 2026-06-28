import { Clock, RefreshCw } from "lucide-react";
import { formatLearnDate } from "@/lib/learn/registry";

type LearnArticleMetaBarProps = {
  readingMinutes: number;
  updatedAt: string;
};

export function LearnArticleMetaBar({ readingMinutes, updatedAt }: LearnArticleMetaBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-4 w-4 shrink-0" aria-hidden />
        {readingMinutes} min read
      </span>
      <span className="inline-flex items-center gap-1.5">
        <RefreshCw className="h-4 w-4 shrink-0" aria-hidden />
        Last updated{" "}
        <time dateTime={updatedAt}>{formatLearnDate(updatedAt)}</time>
      </span>
    </div>
  );
}
