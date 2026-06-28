import { createLearnHead } from "@/lib/learn/seo";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { PaymentsContent } from "@/lib/learn/articles/payments";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Accept Payments Worldwide";
const DESCRIPTION =
  "Accept USDT, bank transfer and cash on VegaPal invoices. Use payment links, wallet payments, QR codes and payment tracking for worldwide payments.";

export const Route = createFileRoute("/learn/payments")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/payments",
      breadcrumbTitle: "Payments",
    }),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <LearnArticleShell title={TITLE} currentId="payments">
      <PaymentsContent />
    </LearnArticleShell>
  );
}
