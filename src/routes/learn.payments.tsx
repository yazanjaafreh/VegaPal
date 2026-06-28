import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath } from "@/lib/learn/registry";
import { PaymentsContent } from "@/lib/learn/articles/payments";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Accept Payments Worldwide";
const DESCRIPTION =
  "Accept USDT, bank transfer and cash on VegaPal invoices. Use payment links, wallet payments, QR codes and payment tracking for worldwide payments.";
const meta = learnArticleByPath("/learn/payments")!;

export const Route = createFileRoute("/learn/payments")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/payments",
      breadcrumbTitle: "Payments",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
    }),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <LearnCategoryArticle path="/learn/payments" title={TITLE}>
      <PaymentsContent />
    </LearnCategoryArticle>
  );
}
