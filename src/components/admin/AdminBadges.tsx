import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS, type UserPlan } from "@/lib/admin/plans";
import { cn } from "@/lib/utils";

const PLAN_STYLES: Record<UserPlan, string> = {
  free: "bg-muted text-foreground border-transparent",
  pro: "bg-warning/15 text-warning border-transparent",
  business: "bg-success/10 text-success border-transparent",
};

export function PlanBadge({ plan, className }: { plan: UserPlan; className?: string }) {
  return (
    <Badge variant="outline" className={cn(PLAN_STYLES[plan], className)}>
      {PLAN_LIMITS[plan].label}
    </Badge>
  );
}

export function AccountStatusBadge({
  status,
  className,
}: {
  status: "active" | "disabled";
  className?: string;
}) {
  const active = status === "active";
  return (
    <Badge
      variant="outline"
      className={cn(
        active ? "bg-success/10 text-success border-transparent" : "bg-destructive/10 text-destructive border-transparent",
        className,
      )}
    >
      {active ? "Active" : "Disabled"}
    </Badge>
  );
}
