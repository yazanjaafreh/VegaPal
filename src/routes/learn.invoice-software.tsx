import { LearnSeoArticle } from "@/components/learn/LearnSeoArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { ARTICLE_CONFIG, ArticleContent } from "@/lib/learn/sprint1/invoice-software";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/invoice-software")({
  head: () =>
    createLearnHead({
      title: ARTICLE_CONFIG.title,
      description: ARTICLE_CONFIG.description,
      path: ARTICLE_CONFIG.path,
      breadcrumbTitle: ARTICLE_CONFIG.breadcrumbTitle,
      faq: ARTICLE_CONFIG.faq,
    }),
  component: InvoiceSoftwarePage,
});

function InvoiceSoftwarePage() {
  const { heroTitle, intro, toc, related, faq } = ARTICLE_CONFIG;
  return (
    <LearnSeoArticle heroTitle={heroTitle} intro={intro} toc={toc} related={related} faq={faq}>
      <ArticleContent />
    </LearnSeoArticle>
  );
}
