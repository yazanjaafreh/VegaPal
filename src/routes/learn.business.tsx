import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath } from "@/lib/learn/registry";
import { BusinessContent } from "@/lib/learn/articles/business";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Invoice Management for Businesses";
const DESCRIPTION =
  "Use the VegaPal invoice dashboard for business reports, revenue overview, payment tracking, exports to Excel and PDF, and professional billing.";
const meta = learnArticleByPath("/learn/business")!;

export const Route = createFileRoute("/learn/business")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/business",
      breadcrumbTitle: "Business",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
    }),
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <LearnCategoryArticle path="/learn/business" title={TITLE}>
      <BusinessContent />
    </LearnCategoryArticle>
  );
}
