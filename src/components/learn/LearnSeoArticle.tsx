import type { ReactNode } from "react";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { LearnArticleFaq } from "@/components/learn/LearnArticleFaq";
import { LearnArticleMetaBar } from "@/components/learn/LearnArticleMetaBar";
import { LearnArticleNav } from "@/components/learn/LearnArticleNav";
import { LearnArticleSidebar } from "@/components/learn/LearnArticleSidebar";
import { LearnCollapsibleToc } from "@/components/learn/LearnCollapsibleToc";
import { LearnInternalLinks } from "@/components/learn/LearnInternalLinks";
import { LearnProse } from "@/components/learn/LearnProse";
import { LearnRegisterCta } from "@/components/learn/LearnRegisterCta";
import { LearnRelatedArticles } from "@/components/learn/LearnRelatedArticles";
import type { LearnArticleMeta, LearnArticleNavLink, LearnFaqItem, LearnRelatedArticle, LearnTocItem } from "@/lib/learn/types";

type LearnSeoArticleProps = {
  heroTitle: string;
  intro: ReactNode;
  meta: LearnArticleMeta;
  toc: LearnTocItem[];
  related: LearnRelatedArticle[];
  faq: LearnFaqItem[];
  prev?: LearnArticleNavLink;
  next?: LearnArticleNavLink;
  children: ReactNode;
};

export function LearnSeoArticle({
  heroTitle,
  intro,
  meta,
  toc,
  related,
  faq,
  prev,
  next,
  children,
}: LearnSeoArticleProps) {
  return (
    <LearnArticleShell
      title={heroTitle}
      intro={intro}
      breadcrumbCategory={meta.category}
      breadcrumbCategoryPath={meta.categoryPath}
      breadcrumbArticle={heroTitle}
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 xl:gap-14">
        <div className="min-w-0 space-y-8">
          <LearnCollapsibleToc items={toc} />
          <LearnArticleMetaBar readingMinutes={meta.readingMinutes} updatedAt={meta.updatedAt} />
          <LearnProse>{children}</LearnProse>
          <LearnArticleFaq items={faq} />
          <LearnArticleNav prev={prev} next={next} />
          <LearnRelatedArticles items={related} />
          <LearnRegisterCta />
          <LearnInternalLinks />
        </div>
        <LearnArticleSidebar toc={toc} related={related} />
      </div>
    </LearnArticleShell>
  );
}
