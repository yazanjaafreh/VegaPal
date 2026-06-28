import { createLearnHead } from "@/lib/learn/seo";
import { LearnArticleShell } from "@/components/learn/LearnArticleShell";
import { GettingStartedContent } from "@/lib/learn/articles/getting-started";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Getting Started with VegaPal";
const DESCRIPTION =
  "Create your VegaPal account in under one minute, build your first invoice in around 30 seconds, and manage billing from one secure dashboard.";

export const Route = createFileRoute("/learn/getting-started")({
  head: () =>
    createLearnHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/learn/getting-started",
      breadcrumbTitle: "Getting Started",
    }),
  component: GettingStartedPage,
});

function GettingStartedPage() {
  return (
    <LearnArticleShell title={TITLE} currentId="getting-started">
      <GettingStartedContent />
    </LearnArticleShell>
  );
}
