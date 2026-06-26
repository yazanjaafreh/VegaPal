import { useTranslation } from "react-i18next";
import type { Invoice, InvoiceStatus } from "@/lib/vegapal-store";

const STATUS_STYLES: Record<InvoiceStatus, { bg: string; dot: string }> = {
  draft: { bg: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  pending: { bg: "bg-warning/15 text-warning", dot: "bg-warning" },
  paid: { bg: "bg-success/10 text-success", dot: "bg-success" },
  overdue: { bg: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  cancelled: { bg: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

export function StatusBadge({ status }: { status: Invoice["status"] }) {
  const { t } = useTranslation("common");
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {t(`status.${status}`)}
    </span>
  );
}

export function StatusPill({ status }: { status: Invoice["status"] }) {
  const { t } = useTranslation("common");
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  const label =
    status === "pending" ? t("status.awaitingPayment") : t(`status.${status}`);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {label}
    </span>
  );
}
