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
} from "lucide-react";
import { fetchAdminStats, type AdminStats } from "@/lib/admin/admin-client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

const STAT_CARD_CLASS = "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft";

function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load stats"));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto min-w-0">
      <div className="mb-8">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">Admin</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview for users, plans, and invoices.</p>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : !stats ? (
        <p className="text-sm text-muted-foreground">Loading metrics…</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total users" value={stats.totalUsers} icon={Users} accent="bg-primary/10 text-primary" />
          <StatCard label="New users today" value={stats.newUsersToday} icon={UserPlus} accent="bg-navy/5 text-navy dark:text-foreground" />
          <StatCard label="Free users" value={stats.freeUsers} icon={Sparkles} accent="bg-muted text-foreground" />
          <StatCard label="Pro users" value={stats.proUsers} icon={Crown} accent="bg-warning/15 text-warning" />
          <StatCard label="Business users" value={stats.businessUsers} icon={Building2} accent="bg-success/10 text-success" />
          <StatCard label="Total invoices" value={stats.totalInvoices} icon={FileText} accent="bg-navy/5 text-navy dark:text-foreground" />
          <StatCard label="Paid invoices" value={stats.paidInvoices} icon={CheckCircle2} accent="bg-success/10 text-success" />
          <StatCard label="Pending invoices" value={stats.pendingInvoices} icon={Clock} accent="bg-warning/15 text-warning" />
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
