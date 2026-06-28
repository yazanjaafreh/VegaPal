import { createLearnHead } from "@/lib/learn/seo";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { SecurityContent } from "@/lib/learn/articles/security";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Secure Invoice Platform";
const DESCRIPTION =
  "Learn how VegaPal protects invoices with encrypted data, safe payment links, access control and options to hide customer or seller information.";

export const Route = createFileRoute("/learn/security")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/security",
      breadcrumbTitle: "Security",
    }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <LearnArticleShell title={TITLE} currentId="security">
      <SecurityContent />
    </LearnArticleShell>
  );
}
