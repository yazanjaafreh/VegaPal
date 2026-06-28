import type { ReactNode } from "react";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { LearnArticleFaq } from "@/components/learn/LearnArticleFaq";
import { LearnProse } from "@/components/learn/LearnProse";
import { LearnRegisterCta } from "@/components/learn/LearnRegisterCta";
import { LearnRelatedArticles } from "@/components/learn/LearnRelatedArticles";
import { LearnTableOfContents } from "@/components/learn/LearnTableOfContents";
import type { LearnFaqItem, LearnRelatedArticle, LearnTocItem } from "@/lib/learn/types";

type LearnSeoArticleProps = {
  heroTitle: string;
  intro: ReactNode;
  toc: LearnTocItem[];
  related: LearnRelatedArticle[];
  faq: LearnFaqItem[];
  children: ReactNode;
};

export function LearnSeoArticle({ heroTitle, intro, toc, related, faq, children }: LearnSeoArticleProps) {
  return (
    <LearnArticleShell title={heroTitle} intro={intro}>
      <LearnTableOfContents items={toc} />
      <LearnProse>{children}</LearnProse>
      <LearnArticleFaq items={faq} />
      <LearnRelatedArticles items={related} />
      <LearnRegisterCta />
    </LearnArticleShell>
  );
}
