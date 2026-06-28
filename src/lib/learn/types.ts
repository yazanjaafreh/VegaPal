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
