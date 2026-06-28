import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { LEARN_FAQ_ITEMS } from "@/lib/learn/articles/faq-data";
import { FaqContent } from "@/lib/learn/articles/faq";
import { learnArticleByPath } from "@/lib/learn/registry";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "VegaPal FAQ | Invoices, USDT Payments & Billing";
const DESCRIPTION =
  "Frequently asked questions about invoices, bills, billing, USDT payments, bank transfers, PDF export, security and VegaPal support.";
const meta = learnArticleByPath("/learn/faq")!;

export const Route = createFileRoute("/learn/faq")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/faq",
      breadcrumbTitle: "FAQ",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
      faq: LEARN_FAQ_ITEMS,
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <LearnCategoryArticle path="/learn/faq" title="Frequently Asked Questions">
      <FaqContent />
    </LearnCategoryArticle>
  );
}
