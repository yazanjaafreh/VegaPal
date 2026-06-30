import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  FileText,
  CheckCircle2,
  Clock,
  Crown,
  Building2,
  Sparkles,
  UserX,
  CalendarDays,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchAdminStats, type AdminStats } from "@/lib/admin/admin-client";
import { formatAppError } from "@/lib/auth/errors";
import { ensureNamespacesLoaded } from "@/lib/i18n/load-namespace";
import { FormError } from "@/components/ui/form-error";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => ensureNamespacesLoaded(["admin"]),
  component: AdminDashboardPage,
});

const STAT_CARD_CLASS = "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft";

function AdminDashboardPage() {
  const { t } = useTranslation("admin");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(formatAppError(err)));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto min-w-0">
      <div className="mb-8">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">{t("eyebrow")}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.subtitle")}</p>
      </div>

      {error ? (
        <FormError message={error} />
      ) : !stats ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.loading")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <StatCard label={t("dashboard.stats.totalUsers")} value={stats.totalUsers} icon={Users} accent="bg-primary/10 text-primary" />
          <StatCard label={t("dashboard.stats.newUsersToday")} value={stats.newUsersToday} icon={UserPlus} accent="bg-navy/5 text-navy dark:text-foreground" />
          <StatCard label={t("dashboard.stats.newUsersThisMonth")} value={stats.newUsersThisMonth} icon={CalendarDays} accent="bg-navy/5 text-navy dark:text-foreground" />
          <StatCard label={t("dashboard.stats.freeUsers")} value={stats.freeUsers} icon={Sparkles} accent="bg-muted text-foreground" />
          <StatCard label={t("dashboard.stats.proUsers")} value={stats.proUsers} icon={Crown} accent="bg-warning/15 text-warning" />
          <StatCard label={t("dashboard.stats.businessUsers")} value={stats.businessUsers} icon={Building2} accent="bg-success/10 text-success" />
          <StatCard label={t("dashboard.stats.disabledUsers")} value={stats.disabledUsers} icon={UserX} accent="bg-destructive/10 text-destructive" />
          <StatCard label={t("dashboard.stats.totalInvoices")} value={stats.totalInvoices} icon={FileText} accent="bg-navy/5 text-navy dark:text-foreground" />
          <StatCard label={t("dashboard.stats.invoicesThisMonth")} value={stats.invoicesThisMonth} icon={FileText} accent="bg-primary/10 text-primary" />
          <StatCard label={t("dashboard.stats.paidInvoices")} value={stats.paidInvoices} icon={CheckCircle2} accent="bg-success/10 text-success" />
          <StatCard label={t("dashboard.stats.pendingInvoices")} value={stats.pendingInvoices} icon={Clock} accent="bg-warning/15 text-warning" />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className={STAT_CARD_CLASS}>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}
