import { LearnSeoArticle } from "@/components/learn/LearnSeoArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath, sprint1NavFor } from "@/lib/learn/registry";
import { ARTICLE_CONFIG, ArticleContent } from "@/lib/learn/sprint1/invoice-generator";
import { createFileRoute } from "@tanstack/react-router";

const meta = learnArticleByPath("/learn/invoice-generator")!;
const nav = sprint1NavFor("/learn/invoice-generator");

export const Route = createFileRoute("/learn/invoice-generator")({
  head: () =>
    createLearnHead({
      title: ARTICLE_CONFIG.title,
      description: ARTICLE_CONFIG.description,
      path: ARTICLE_CONFIG.path,
      breadcrumbTitle: ARTICLE_CONFIG.breadcrumbTitle,
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
      faq: ARTICLE_CONFIG.faq,
    }),
  component: InvoiceGeneratorPage,
});

function InvoiceGeneratorPage() {
  const { heroTitle, intro, toc, related, faq } = ARTICLE_CONFIG;
  return (
    <LearnSeoArticle
      heroTitle={heroTitle}
      intro={intro}
      meta={meta}
      toc={toc}
      related={related}
      faq={faq}
      prev={nav.prev}
      next={nav.next}
    >
      <ArticleContent />
    </LearnSeoArticle>
  );
}
