import { supabase } from "@/integrations/supabase/client";
import type { UserPlan } from "@/lib/admin/plans";

export type AdminStats = {
  totalUsers: number;
  newUsersToday: number;
  freeUsers: number;
  proUsers: number;
  businessUsers: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  business: string | null;
  plan: UserPlan;
  role: string;
  isDisabled: boolean;
  joinedAt: string;
  lastSignInAt: string | null;
  invoiceCount: number;
  paidInvoiceCount: number;
  pendingInvoiceCount: number;
  status: "active" | "disabled";
};

export type AdminUserDetail = AdminUserRow & {
  companyAddress: string | null;
  website: string | null;
  contactEmail: string | null;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  invoiceCountThisMonth: number;
  recentInvoices: {
    id: string;
    number: string;
    title: string;
    clientName: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
};

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function fetchAdminMe(): Promise<{ isAdmin: boolean }> {
  return adminFetch("/api/admin/me");
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return adminFetch("/api/admin/stats");
}

export async function fetchAdminUsers(): Promise<{ users: AdminUserRow[] }> {
  return adminFetch("/api/admin/users");
}

export async function fetchAdminUser(userId: string): Promise<AdminUserDetail> {
  return adminFetch(`/api/admin/users/${encodeURIComponent(userId)}`);
}

export async function updateAdminUser(
  userId: string,
  patch: { plan?: UserPlan; isDisabled?: boolean },
): Promise<{ id: string; plan: UserPlan; isDisabled: boolean; status: string }> {
  return adminFetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
