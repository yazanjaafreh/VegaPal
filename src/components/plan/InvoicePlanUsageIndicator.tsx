import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getInvoicePlanUsage, type InvoicePlanUsage } from "@/lib/vegapal-store";
import {
  formatInvoicePlanUsageLabel,
  FREE_PLAN_LIMIT_MESSAGE,
  isAtFreePlanInvoiceLimit,
} from "@/lib/plan/invoice-limit";

type InvoicePlanUsageIndicatorProps = {
  className?: string;
  showUpgradeWhenLimited?: boolean;
};

export function InvoicePlanUsageIndicator({
  className,
  showUpgradeWhenLimited = false,
}: InvoicePlanUsageIndicatorProps) {
  const [usage, setUsage] = useState<InvoicePlanUsage | null>(null);

  useEffect(() => {
    void getInvoicePlanUsage().then(setUsage);
  }, []);

  if (!usage) return null;

  const limited = isAtFreePlanInvoiceLimit(usage);

  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{formatInvoicePlanUsageLabel(usage)}</p>
      {showUpgradeWhenLimited && limited ? (
        <div className="mt-3 rounded-xl border border-warning/30 bg-warning/5 p-4 space-y-3">
          <p className="text-sm leading-relaxed">{FREE_PLAN_LIMIT_MESSAGE}</p>
          <Button asChild size="sm" variant="hero">
            <Link to="/pricing">Upgrade plan</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
