import { createLearnHead } from "@/lib/learn/seo";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { BusinessContent } from "@/lib/learn/articles/business";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Invoice Management for Businesses";
const DESCRIPTION =
  "Use the VegaPal invoice dashboard for business reports, revenue overview, payment tracking, exports to Excel and PDF, and professional billing.";

export const Route = createFileRoute("/learn/business")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/business",
      breadcrumbTitle: "Business",
    }),
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <LearnArticleShell title={TITLE} currentId="business">
      <BusinessContent />
    </LearnArticleShell>
  );
}
