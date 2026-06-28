export type LearnFaqItem = {
  question: string;
  answer: string;
};

export type LearnTocItem = {
  id: string;
  label: string;
};

export type LearnRelatedArticle = {
  path: `/learn/${string}`;
  title: string;
};

export type LearnArticleNavLink = {
  path: `/learn/${string}`;
  title: string;
};

export type LearnArticleMeta = {
  path: `/learn/${string}`;
  title: string;
  description: string;
  category: string;
  categoryPath: `/learn/${string}`;
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  featured?: boolean;
};
