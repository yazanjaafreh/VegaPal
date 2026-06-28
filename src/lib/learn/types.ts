import type { FileRoutesByTo } from "@/routeTree.gen";

/** Registered TanStack Router paths under /learn */
export type LearnRoutePath = Extract<keyof FileRoutesByTo, `/learn${string}`>;

export type LearnFaqItem = {
  question: string;
  answer: string;
};

export type LearnTocItem = {
  id: string;
  label: string;
};

export type LearnRelatedArticle = {
  path: LearnRoutePath;
  title: string;
};

export type LearnArticleNavLink = {
  path: LearnRoutePath;
  title: string;
};

export type LearnArticleMeta = {
  path: LearnRoutePath;
  title: string;
  description: string;
  category: string;
  categoryPath: LearnRoutePath;
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  featured?: boolean;
};
