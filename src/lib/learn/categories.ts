import {
  BookOpen,
  FileText,
  Wallet,
  ShieldCheck,
  Building2,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";

export const LEARN_BASE_URL = "https://vega-pal.com";

export type LearnCategoryId =
  | "getting-started"
  | "invoice"
  | "payments"
  | "security"
  | "business"
  | "faq";

export type LearnCategory = {
  id: LearnCategoryId;
  path: `/learn/${LearnCategoryId}`;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    id: "getting-started",
    path: "/learn/getting-started",
    title: "Getting Started",
    description:
      "Set up your VegaPal account, understand the dashboard, and send your first invoice in minutes.",
    icon: BookOpen,
  },
  {
    id: "invoice",
    path: "/learn/invoice",
    title: "Invoice",
    description:
      "Create professional invoices, customize line items, currencies, and PDF exports for your clients.",
    icon: FileText,
  },
  {
    id: "payments",
    path: "/learn/payments",
    title: "Payments",
    description:
      "Accept USDT and other payment methods with shareable payment links and wallet-based checkout flows.",
    icon: Wallet,
  },
  {
    id: "security",
    path: "/learn/security",
    title: "Security",
    description:
      "Learn how VegaPal protects your data, secures payment pages, and helps you run trusted business deals.",
    icon: ShieldCheck,
  },
  {
    id: "business",
    path: "/learn/business",
    title: "Business",
    description:
      "Best practices for freelancers and teams managing recurring clients, subscriptions, and crypto billing.",
    icon: Building2,
  },
  {
    id: "faq",
    path: "/learn/faq",
    title: "FAQ",
    description:
      "Answers to common questions about USDT payments, invoices, wallets, networks, and account management.",
    icon: CircleHelp,
  },
];

export function learnCategoryById(id: LearnCategoryId): LearnCategory {
  const category = LEARN_CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown learn category: ${id}`);
  return category;
}
