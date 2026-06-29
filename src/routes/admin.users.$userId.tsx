import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { StatusBadge } from "@/components/StatusBadge";
import { AccountStatusBadge, PlanBadge } from "@/components/admin/AdminBadges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  fetchAdminUser,
  updateAdminUser,
  type AdminUserDetail,
} from "@/lib/admin/admin-client";
import { PLAN_LIMITS, USER_PLANS, type UserPlan } from "@/lib/admin/plans";
import { formatAppError } from "@/lib/auth/errors";

export const Route = createFileRoute("/admin/users/$userId")({
  component: AdminUserDetailPage,
});

function AdminUserDetailPage() {
  const { userId } = Route.useParams();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState<UserPlan | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    fetchAdminUser(userId)
      .then(setUser)
      .catch((err) => setError(formatAppError(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function changePlan(plan: UserPlan) {
    if (user?.plan === plan) return;
    setSavingPlan(plan);
    setSuccess("");
    setError("");
    try {
      await updateAdminUser(userId, { plan });
      setSuccess(`Plan updated to ${PLAN_LIMITS[plan].label}.`);
      load();
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSavingPlan(null);
    }
  }

  async function setDisabled(isDisabled: boolean) {
    setSavingStatus(true);
    setSuccess("");
    setError("");
    try {
      await updateAdminUser(userId, { isDisabled });
      setSuccess(isDisabled ? "User disabled." : "User re-enabled.");
      load();
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading && !user) {
    return <div className="p-6 text-sm text-muted-foreground">Loading user…</div>;
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <FormError message={error || "User not found."} />
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
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
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wider w-full sm:w-auto">
            User detail
          </p>
          <PlanBadge plan={user.plan} />
          <AccountStatusBadge status={user.status} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 break-words">
          {user.name || user.email}
        </h1>
        <p className="text-muted-foreground mt-1 break-all">{user.email}</p>
      </div>

      {success ? <FormSuccess message={success} /> : null}
      <FormError message={error} />

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <DetailItem label="Name" value={user.name || "—"} />
            <DetailItem label="Email" value={user.email || "—"} />
            <DetailItem label="Business" value={user.business || "—"} />
            <DetailItem label="Plan" value={planInfo.label} />
            <DetailItem label="Joined" value={formatDateTime(user.joinedAt)} />
            <DetailItem
              label="Last sign in"
              value={user.lastSignInAt ? formatDateTime(user.lastSignInAt) : "—"}
            />
            <DetailItem label="Invoices this month" value={String(user.invoiceCountThisMonth)} />
            <DetailItem label="Total invoices" value={String(user.invoiceCount)} />
            <DetailItem label="Paid" value={String(user.paidInvoiceCount)} />
            <DetailItem label="Pending" value={String(user.pendingInvoiceCount)} />
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5">
          <h2 className="font-semibold">Plan management</h2>
          <p className="text-sm text-muted-foreground">
            {planInfo.maxUsers} user{planInfo.maxUsers === 1 ? "" : "s"},{" "}
            {planInfo.maxInvoicesPerMonth === "unlimited"
              ? "unlimited invoices"
              : `${planInfo.maxInvoicesPerMonth} invoices per month`}
            .
          </p>
          <div className="flex flex-wrap gap-2">
            {USER_PLANS.map((plan) => (
              <LoadingButton
                key={plan}
                size="sm"
                variant={user.plan === plan ? "default" : "outline"}
                disabled={user.plan === plan || savingPlan !== null || savingStatus}
                loading={savingPlan === plan}
                onClick={() => changePlan(plan)}
              >
                Set {PLAN_LIMITS[plan].label}
              </LoadingButton>
            ))}
          </div>

          <div className="border-t border-border pt-5 space-y-3">
            <h3 className="font-medium text-sm">Account status</h3>
            {user.isDisabled ? (
              <LoadingButton
                size="sm"
                variant="outline"
                loading={savingStatus}
                disabled={savingPlan !== null}
                onClick={() => setDisabled(false)}
              >
                Enable user
              </LoadingButton>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <LoadingButton
                    size="sm"
                    variant="destructive"
                    loading={savingStatus}
                    disabled={savingPlan !== null}
                  >
                    Disable user
                  </LoadingButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disable this user?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.email} will be signed out and unable to sign in until re-enabled.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setDisabled(true)}>
                      Disable user
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="px-5 sm:px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent invoices</h2>
        </div>
        {user.recentInvoices.length === 0 ? (
          <p className="px-5 sm:px-6 py-8 text-sm text-muted-foreground">No invoices yet.</p>
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
                      <StatusBadge
                        status={
                          invoice.status as "paid" | "pending" | "overdue" | "draft" | "cancelled"
                        }
                      />
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
