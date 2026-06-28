import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath } from "@/lib/learn/registry";
import { SecurityContent } from "@/lib/learn/articles/security";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Secure Invoice Platform";
const DESCRIPTION =
  "Learn how VegaPal protects invoices with encrypted data, safe payment links, access control and options to hide customer or seller information.";
const meta = learnArticleByPath("/learn/security")!;

export const Route = createFileRoute("/learn/security")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/security",
      breadcrumbTitle: "Security",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
    }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <LearnCategoryArticle path="/learn/security" title={TITLE}>
      <SecurityContent />
    </LearnCategoryArticle>
  );
}
