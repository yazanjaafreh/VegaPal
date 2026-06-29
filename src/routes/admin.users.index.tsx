import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { AccountStatusBadge, PlanBadge } from "@/components/admin/AdminBadges";
import { fetchAdminUsers, type AdminUserRow } from "@/lib/admin/admin-client";
import { formatAppError } from "@/lib/auth/errors";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(formatAppError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto min-w-0">
      <div className="mb-8">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">Admin</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Users</h1>
        <p className="text-muted-foreground mt-1">Manage accounts, plans, and access status.</p>
      </div>

      {error ? (
        <div className="mb-4">
          <FormError message={error} />
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Last sign in</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Invoices</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{user.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground break-all">{user.email || "—"}</td>
                    <td className="px-4 py-3">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.joinedAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.lastSignInAt ? formatDate(user.lastSignInAt) : "—"}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{user.invoiceCount}</td>
                    <td className="px-4 py-3">
                      <AccountStatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/admin/users/$userId" params={{ userId: user.id }}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}
