import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  fetchAdminUser,
  updateAdminUser,
  type AdminUserDetail,
} from "@/lib/admin/admin-client";
import { PLAN_LIMITS, USER_PLANS, type UserPlan } from "@/lib/admin/plans";

export const Route = createFileRoute("/admin/users/$userId")({
  component: AdminUserDetailPage,
});

function AdminUserDetailPage() {
  const { userId } = Route.useParams();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    fetchAdminUser(userId)
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load user"));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function changePlan(plan: UserPlan) {
    setSaving(true);
    setMessage(null);
    try {
      await updateAdminUser(userId, { plan });
      setMessage(`Plan updated to ${PLAN_LIMITS[plan].label}.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  }

  async function setDisabled(isDisabled: boolean) {
    setSaving(true);
    setMessage(null);
    try {
      await updateAdminUser(userId, { isDisabled });
      setMessage(isDisabled ? "User disabled." : "User re-enabled.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  if (error && !user) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-destructive text-sm">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-sm text-muted-foreground">Loading user…</div>;
  }

  const planInfo = PLAN_LIMITS[user.plan];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto min-w-0 space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link to="/admin/users">
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>
        </Button>
        <p className="text-xs font-medium text-primary uppercase tracking-wider">User detail</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{user.name || user.email}</h1>
        <p className="text-muted-foreground mt-1">{user.email}</p>
      </div>

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <DetailItem label="Name" value={user.name || "—"} />
            <DetailItem label="Email" value={user.email || "—"} />
            <DetailItem label="Business" value={user.business || "—"} />
            <DetailItem label="Plan" value={planInfo.label} />
            <DetailItem label="Created" value={formatDateTime(user.createdAt)} />
            <DetailItem
              label="Last sign in"
              value={user.lastSignInAt ? formatDateTime(user.lastSignInAt) : "—"}
            />
            <DetailItem label="Invoices" value={String(user.invoiceCount)} />
            <DetailItem label="Paid" value={String(user.paidInvoiceCount)} />
            <DetailItem label="Pending" value={String(user.pendingInvoiceCount)} />
            <DetailItem label="Status" value={user.status === "active" ? "Active" : "Disabled"} />
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-5">
          <h2 className="font-semibold">Plan management</h2>
          <p className="text-sm text-muted-foreground">
            {planInfo.maxUsers} user{planInfo.maxUsers === 1 ? "" : "s"},{" "}
            {planInfo.maxInvoicesPerMonth === "unlimited"
              ? "unlimited invoices"
              : `${planInfo.maxInvoicesPerMonth} invoices per month`}
            .
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            {planInfo.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {USER_PLANS.map((plan) => (
              <Button
                key={plan}
                size="sm"
                variant={user.plan === plan ? "default" : "outline"}
                disabled={saving || user.plan === plan}
                onClick={() => changePlan(plan)}
              >
                {PLAN_LIMITS[plan].label}
              </Button>
            ))}
          </div>

          <div className="border-t border-border pt-5 space-y-3">
            <h3 className="font-medium text-sm">Account status</h3>
            {user.isDisabled ? (
              <Button size="sm" variant="outline" disabled={saving} onClick={() => setDisabled(false)}>
                Re-enable user
              </Button>
            ) : (
              <Button size="sm" variant="destructive" disabled={saving} onClick={() => setDisabled(true)}>
                Disable user
              </Button>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent invoices</h2>
        </div>
        {user.recentInvoices.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Number</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                {user.recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{invoice.number}</td>
                    <td className="px-4 py-3">{invoice.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{invoice.clientName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={invoice.status as "paid" | "pending" | "overdue" | "draft" | "cancelled"} />
                    </td>
                    <td className="px-4 py-3 tabular-nums">{invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(invoice.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium break-words">{value}</dd>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
