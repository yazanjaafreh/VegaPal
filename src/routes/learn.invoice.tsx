import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath } from "@/lib/learn/registry";
import { InvoiceContent } from "@/lib/learn/articles/invoice";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Professional Invoice & Bill Generator";
const DESCRIPTION =
  "VegaPal is invoice software and a bill generator. Create online invoices, manage billing, export PDF and Excel, and track paid and unpaid invoices.";
const meta = learnArticleByPath("/learn/invoice")!;

export const Route = createFileRoute("/learn/invoice")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/invoice",
      breadcrumbTitle: "Invoice",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
    }),
  component: InvoicePage,
});

function InvoicePage() {
  return (
    <LearnCategoryArticle path="/learn/invoice" title={TITLE}>
      <InvoiceContent />
    </LearnCategoryArticle>
  );
}
