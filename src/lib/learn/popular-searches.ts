import type { LearnRoutePath } from "@/lib/learn/types";

export type LearnPopularSearch = {
  label: string;
  path: LearnRoutePath;
};

export const LEARN_POPULAR_SEARCHES: LearnPopularSearch[] = [
  { label: "Invoice", path: "/learn/what-is-an-invoice" },
  { label: "Bill", path: "/learn/what-is-a-bill" },
  { label: "Invoice Generator", path: "/learn/invoice-generator" },
  { label: "Invoice Software", path: "/learn/invoice-software" },
  { label: "Billing", path: "/learn/invoice-vs-bill" },
  { label: "Payment Link", path: "/learn/payments" },
  { label: "Payment Request", path: "/learn/what-is-an-invoice" },
  { label: "Invoice PDF", path: "/learn/invoice" },
  { label: "Invoice Template", path: "/learn/invoice-generator" },
  { label: "USDT", path: "/learn/payments" },
  { label: "Crypto Invoice", path: "/learn/payments" },
  { label: "TRON", path: "/learn/faq" },
  { label: "ERC20", path: "/learn/faq" },
  { label: "BEP20", path: "/learn/faq" },
  { label: "Bank Transfer", path: "/learn/payments" },
  { label: "IBAN", path: "/learn/faq" },
  { label: "Business Invoice", path: "/learn/invoice" },
  { label: "Freelancer Invoice", path: "/learn/business" },
  { label: "Secure Invoice", path: "/learn/security" },
  { label: "Payment Tracking", path: "/learn/invoice-software" },
];
