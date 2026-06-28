import { LEARN_BASE_URL } from "./categories";
import type { LearnFaqItem } from "./types";

type LearnHeadConfig = {
  title: string;
  description: string;
  path: `/learn${string}`;
  breadcrumbTitle: string;
  categoryTitle?: string;
  categoryPath?: `/learn${string}`;
  dateModified?: string;
  faq?: LearnFaqItem[];
};

export function createLearnHead({
  title,
  description,
  path,
  breadcrumbTitle,
  categoryTitle,
  categoryPath,
  dateModified,
  faq,
}: LearnHeadConfig) {
  const url = `${LEARN_BASE_URL}${path}`;

  const breadcrumbItems: { "@type": string; position: number; name: string; item?: string }[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${LEARN_BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Learn", item: `${LEARN_BASE_URL}/learn` },
  ];

  if (categoryTitle && categoryPath) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: categoryTitle,
      item: `${LEARN_BASE_URL}${categoryPath}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: breadcrumbTitle,
      item: url,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: breadcrumbTitle,
      item: url,
    });
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: "VegaPal",
      url: `${LEARN_BASE_URL}/`,
    },
  };

  if (dateModified) {
    articleLd.dateModified = dateModified;
  }

  const scripts = [
    { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
    { type: "application/ld+json", children: JSON.stringify(articleLd) },
  ];

  if (faq?.length) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
