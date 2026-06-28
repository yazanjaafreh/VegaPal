import {
  BookOpen,
  Building2,
  CircleHelp,
  Code2,
  FileSpreadsheet,
  FileText,
  Landmark,
  ShieldCheck,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type LearnTopic = {
  id: string;
  title: string;
  path: `/learn/${string}`;
  icon: LucideIcon;
};

export const LEARN_TOPICS: LearnTopic[] = [
  { id: "getting-started", title: "Getting Started", path: "/learn/getting-started", icon: BookOpen },
  { id: "invoice", title: "Invoice", path: "/learn/invoice", icon: FileText },
  { id: "payments", title: "Payments", path: "/learn/payments", icon: Wallet },
  { id: "security", title: "Security", path: "/learn/security", icon: ShieldCheck },
  { id: "business", title: "Business", path: "/learn/business", icon: Building2 },
  { id: "faq", title: "FAQ", path: "/learn/faq", icon: CircleHelp },
  { id: "api", title: "API", path: "/learn/getting-started", icon: Code2 },
  { id: "reports", title: "Reports", path: "/learn/invoice", icon: FileSpreadsheet },
  { id: "crypto", title: "Crypto", path: "/learn/payments", icon: Wallet },
  { id: "bank-transfer", title: "Bank Transfer", path: "/learn/payments", icon: Landmark },
  { id: "freelancers", title: "Freelancers", path: "/learn/business", icon: UserRound },
  { id: "invoice-templates", title: "Invoice Templates", path: "/learn/invoice-generator", icon: FileText },
];
