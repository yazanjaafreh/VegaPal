import { LearnCategoryArticle } from "@/components/learn/LearnCategoryArticle";
import { createLearnHead } from "@/lib/learn/seo";
import { learnArticleByPath } from "@/lib/learn/registry";
import { GettingStartedContent } from "@/lib/learn/articles/getting-started";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Getting Started with VegaPal";
const DESCRIPTION =
  "Create your VegaPal account in under one minute, build your first invoice in around 30 seconds, and manage billing from one secure dashboard.";
const meta = learnArticleByPath("/learn/getting-started")!;

export const Route = createFileRoute("/learn/getting-started")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/getting-started",
      breadcrumbTitle: "Getting Started",
      categoryTitle: meta.category,
      categoryPath: meta.categoryPath,
      dateModified: meta.updatedAt,
    }),
  component: GettingStartedPage,
});

function GettingStartedPage() {
  return (
    <LearnCategoryArticle path="/learn/getting-started" title={TITLE}>
      <GettingStartedContent />
    </LearnCategoryArticle>
  );
}
