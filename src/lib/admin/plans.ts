export type UserPlan = "free" | "pro" | "business";

export const USER_PLANS: UserPlan[] = ["free", "pro", "business"];

export type PlanLimits = {
  label: string;
  maxUsers: number | "unlimited";
  maxInvoicesPerMonth: number | "unlimited";
  features: string[];
};

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    label: "Free",
    maxUsers: 1,
    maxInvoicesPerMonth: 3,
    features: ["All features enabled for trial"],
  },
  pro: {
    label: "Pro",
    maxUsers: 2,
    maxInvoicesPerMonth: "unlimited",
    features: ["All features enabled", "Priority support"],
  },
  business: {
    label: "Business",
    maxUsers: 4,
    maxInvoicesPerMonth: "unlimited",
    features: [
      "All features enabled",
      "Team management",
      "Advanced analytics",
      "Priority support",
    ],
  },
};
