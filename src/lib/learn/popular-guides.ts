import { ARTICLE_CONFIG as invoiceGenerator } from "@/lib/learn/sprint1/invoice-generator";
import { ARTICLE_CONFIG as invoiceSoftware } from "@/lib/learn/sprint1/invoice-software";
import { ARTICLE_CONFIG as invoiceVsBill } from "@/lib/learn/sprint1/invoice-vs-bill";
import { ARTICLE_CONFIG as whatIsBill } from "@/lib/learn/sprint1/what-is-a-bill";
import { ARTICLE_CONFIG as whatIsInvoice } from "@/lib/learn/sprint1/what-is-an-invoice";

export type LearnGuideCard = {
  path: `/learn/${string}`;
  title: string;
  description: string;
};

export const POPULAR_INVOICE_GUIDES: LearnGuideCard[] = [
  {
    path: whatIsInvoice.path,
    title: whatIsInvoice.heroTitle,
    description: whatIsInvoice.intro,
  },
  {
    path: whatIsBill.path,
    title: whatIsBill.heroTitle,
    description: whatIsBill.intro,
  },
  {
    path: invoiceVsBill.path,
    title: invoiceVsBill.heroTitle,
    description: invoiceVsBill.intro,
  },
  {
    path: invoiceGenerator.path,
    title: invoiceGenerator.heroTitle,
    description: invoiceGenerator.intro,
  },
  {
    path: invoiceSoftware.path,
    title: invoiceSoftware.heroTitle,
    description: invoiceSoftware.intro,
  },
];
