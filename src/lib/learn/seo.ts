import { LEARN_BASE_URL } from "./categories";
import type { LearnFaqItem } from "./types";

type LearnHeadConfig = {
  title: string;
  description: string;
  path: `/learn${string}`;
  breadcrumbTitle: string;
  faq?: LearnFaqItem[];
};

export function createLearnHead({ title, description, path, breadcrumbTitle, faq }: LearnHeadConfig) {
  const url = `${LEARN_BASE_URL}${path}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Learn VegaPal",
        item: `${LEARN_BASE_URL}/learn`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbTitle,
        item: url,
      },
    ],
  };

  const articleLd = {
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
