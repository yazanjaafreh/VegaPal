import { createLearnHead } from "@/lib/learn/seo";
import { LEARN_FAQ_ITEMS } from "@/lib/learn/articles/faq-data";
import { FaqContent } from "@/lib/learn/articles/faq";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "VegaPal FAQ | Invoices, USDT Payments & Billing";
const DESCRIPTION =
  "Frequently asked questions about invoices, bills, billing, USDT payments, bank transfers, PDF export, security and VegaPal support.";

export const Route = createFileRoute("/learn/faq")({
  head: () => {
    const base = createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/faq",
      breadcrumbTitle: "FAQ",
    });

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: LEARN_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    return {
      ...base,
      scripts: [
        ...(base.scripts ?? []),
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
      ],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  return (
    <LearnArticleShell title="Frequently Asked Questions" currentId="faq">
      <FaqContent />
    </LearnArticleShell>
  );
}
