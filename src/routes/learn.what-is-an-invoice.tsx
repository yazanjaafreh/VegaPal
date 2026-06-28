import { LearnSeoArticle } from "@/components/learn/LearnSeoArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { ARTICLE_CONFIG, ArticleContent } from "@/lib/learn/sprint1/what-is-an-invoice";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/what-is-an-invoice")({
  head: () =>
    createLearnHead({
      title: ARTICLE_CONFIG.title,
      description: ARTICLE_CONFIG.description,
      path: ARTICLE_CONFIG.path,
      breadcrumbTitle: ARTICLE_CONFIG.breadcrumbTitle,
      faq: ARTICLE_CONFIG.faq,
    }),
  component: WhatIsAnInvoicePage,
});

function WhatIsAnInvoicePage() {
  const { heroTitle, intro, toc, related, faq } = ARTICLE_CONFIG;
  return (
    <LearnSeoArticle heroTitle={heroTitle} intro={intro} toc={toc} related={related} faq={faq}>
      <ArticleContent />
    </LearnSeoArticle>
  );
}
