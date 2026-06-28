import type { ReactNode } from "react";
import { LearnArticleMetaBar } from "@/components/learn/LearnArticleMetaBar";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { LearnInternalLinks } from "@/components/learn/LearnInternalLinks";
import { learnArticleByPath } from "@/lib/learn/registry";

type LearnCategoryArticleProps = {
  path: `/learn/${string}`;
  title: string;
  children: ReactNode;
};

export function LearnCategoryArticle({ path, title, children }: LearnCategoryArticleProps) {
  const meta = learnArticleByPath(path);

  return (
    <LearnArticleShell
      title={title}
      breadcrumbCategory={meta?.category ?? title}
      breadcrumbCategoryPath={meta?.categoryPath ?? path}
      breadcrumbArticle={title}
    >
      {meta ? <LearnArticleMetaBar readingMinutes={meta.readingMinutes} updatedAt={meta.updatedAt} /> : null}
      {children}
      <LearnInternalLinks />
    </LearnArticleShell>
  );
}
