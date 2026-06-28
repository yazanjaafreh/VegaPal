import { createLearnHead } from "@/lib/learn/seo";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { InvoiceContent } from "@/lib/learn/articles/invoice";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Professional Invoice & Bill Generator";
const DESCRIPTION =
  "VegaPal is invoice software and a bill generator. Create online invoices, manage billing, export PDF and Excel, and track paid and unpaid invoices.";

export const Route = createFileRoute("/learn/invoice")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/invoice",
      breadcrumbTitle: "Invoice",
    }),
  component: InvoicePage,
});

function InvoicePage() {
  return (
    <LearnArticleShell title={TITLE} currentId="invoice">
      <InvoiceContent />
    </LearnArticleShell>
  );
}
