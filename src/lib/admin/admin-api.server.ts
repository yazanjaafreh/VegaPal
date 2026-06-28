import type { UserPlan } from "@/lib/admin/plans";
import { requireAdminFromRequest } from "@/lib/admin/admin-auth.server";

type ProfileRow = {
  id: string;
  email: string | null;
  name: string;
  business: string | null;
  plan: UserPlan;
  role: string;
  is_disabled: boolean;
  created_at: string;
  updated_at: string;
};

type InvoiceRow = {
  id: string;
  user_id: string;
  number: string;
  title: string;
  client_name: string;
  status: string;
  total: number;
  created_at: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function startOfUtcDay() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

async function loadAuthUsersMap() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const map = new Map<string, { last_sign_in_at: string | null; email: string | null }>();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    for (const user of data.users) {
      map.set(user.id, {
        last_sign_in_at: user.last_sign_in_at ?? null,
        email: user.email ?? null,
      });
    }
    if (data.users.length < perPage) break;
    page += 1;
  }

  return map;
}

async function getStats() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const todayStart = startOfUtcDay();

  const [{ data: profiles, error: profilesError }, { data: invoices, error: invoicesError }] =
    await Promise.all([
      supabaseAdmin.from("profiles").select("id, plan, created_at"),
      supabaseAdmin.from("invoices").select("id, status"),
    ]);

  if (profilesError) throw profilesError;
  if (invoicesError) throw invoicesError;

  const profileRows = profiles ?? [];
  const invoiceRows = invoices ?? [];

  return {
    totalUsers: profileRows.length,
    newUsersToday: profileRows.filter((p) => p.created_at >= todayStart).length,
    freeUsers: profileRows.filter((p) => p.plan === "free").length,
    proUsers: profileRows.filter((p) => p.plan === "pro").length,
    businessUsers: profileRows.filter((p) => p.plan === "business").length,
    totalInvoices: invoiceRows.length,
    paidInvoices: invoiceRows.filter((i) => i.status === "paid").length,
    pendingInvoices: invoiceRows.filter((i) => i.status === "pending").length,
  };
}

async function getUsersList() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: profiles, error: profilesError }, { data: invoices, error: invoicesError }, authMap] =
    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, email, name, business, plan, role, is_disabled, created_at, updated_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("invoices").select("user_id, status"),
      loadAuthUsersMap(),
    ]);

  if (profilesError) throw profilesError;
  if (invoicesError) throw invoicesError;

  const invoiceCounts = new Map<string, { total: number; paid: number; pending: number }>();
  for (const inv of invoices ?? []) {
    const current = invoiceCounts.get(inv.user_id) ?? { total: 0, paid: 0, pending: 0 };
    current.total += 1;
    if (inv.status === "paid") current.paid += 1;
    if (inv.status === "pending") current.pending += 1;
    invoiceCounts.set(inv.user_id, current);
  }

  return (profiles as ProfileRow[]).map((profile) => {
    const counts = invoiceCounts.get(profile.id) ?? { total: 0, paid: 0, pending: 0 };
    const auth = authMap.get(profile.id);
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email ?? auth?.email ?? "",
      business: profile.business,
      plan: profile.plan,
      role: profile.role,
      isDisabled: profile.is_disabled,
      joinedAt: profile.created_at,
      lastSignInAt: auth?.last_sign_in_at ?? null,
      invoiceCount: counts.total,
      paidInvoiceCount: counts.paid,
      pendingInvoiceCount: counts.pending,
      status: profile.is_disabled ? "disabled" : "active",
    };
  });
}

async function getUserDetail(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: profile, error: profileError }, { data: invoices, error: invoicesError }, authMap] =
    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select(
          "id, email, name, business, company_address, website, contact_email, plan, role, is_disabled, created_at, updated_at",
        )
        .eq("id", userId)
        .maybeSingle(),
      supabaseAdmin
        .from("invoices")
        .select("id, user_id, number, title, client_name, status, total, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
      loadAuthUsersMap(),
    ]);

  if (profileError) throw profileError;
  if (invoicesError) throw invoicesError;
  if (!profile) return null;

  const allInvoices = await supabaseAdmin.from("invoices").select("status").eq("user_id", userId);
  if (allInvoices.error) throw allInvoices.error;

  const invoiceRows = allInvoices.data ?? [];
  const auth = authMap.get(userId);

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email ?? auth?.email ?? "",
    business: profile.business,
    companyAddress: profile.company_address,
    website: profile.website,
    contactEmail: profile.contact_email,
    plan: profile.plan as UserPlan,
    role: profile.role,
    isDisabled: profile.is_disabled,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    lastSignInAt: auth?.last_sign_in_at ?? null,
    invoiceCount: invoiceRows.length,
    paidInvoiceCount: invoiceRows.filter((i) => i.status === "paid").length,
    pendingInvoiceCount: invoiceRows.filter((i) => i.status === "pending").length,
    recentInvoices: (invoices as InvoiceRow[]).map((inv) => ({
      id: inv.id,
      number: inv.number,
      title: inv.title,
      clientName: inv.client_name,
      status: inv.status,
      total: Number(inv.total),
      createdAt: inv.created_at,
    })),
    status: profile.is_disabled ? "disabled" : "active",
  };
}

async function patchUser(userId: string, body: { plan?: UserPlan; isDisabled?: boolean }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.plan !== undefined) updates.plan = body.plan;
  if (body.isDisabled !== undefined) updates.is_disabled = body.isDisabled;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, plan, is_disabled")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    plan: data.plan,
    isDisabled: data.is_disabled,
    status: data.is_disabled ? "disabled" : "active",
  };
}

export async function handleAdminApiRequest(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/admin/me") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
      try {
        await requireAdminFromRequest(request);
        return json({ isAdmin: true });
      } catch (response) {
        if (response instanceof Response) {
          if (response.status === 403) return json({ isAdmin: false }, 200);
          return response;
        }
        throw response;
      }
    }

    await requireAdminFromRequest(request);

    if (path === "/api/admin/stats" && request.method === "GET") {
      return json(await getStats());
    }

    if (path === "/api/admin/users" && request.method === "GET") {
      return json({ users: await getUsersList() });
    }

    const userMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (userMatch) {
      const userId = decodeURIComponent(userMatch[1]);

      if (request.method === "GET") {
        const detail = await getUserDetail(userId);
        if (!detail) return json({ error: "User not found" }, 404);
        return json(detail);
      }

      if (request.method === "PATCH") {
        const body = (await request.json()) as { plan?: UserPlan; isDisabled?: boolean };
        if (body.plan && !["free", "pro", "business"].includes(body.plan)) {
          return json({ error: "Invalid plan" }, 400);
        }
        const updated = await patchUser(userId, body);
        if (!updated) return json({ error: "User not found" }, 404);
        return json(updated);
      }

      return json({ error: "Method not allowed" }, 405);
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[admin-api]", error);
    return json({ error: "Internal server error" }, 500);
  }
}
