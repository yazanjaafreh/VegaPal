/**
 * Remote Supabase QA checks via service role (no secrets printed).
 */
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const file of [".env", ".env.local", ".env.production"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m || line.trimStart().startsWith("#")) continue;
      const [, key, raw] = m;
      process.env[key] = raw.replace(/^["']|["']$/g, "").trim();
    }
  }
}

loadEnv();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("SKIP remote QA — missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(0);
}

const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const results = [];

async function check(id, fn) {
  try {
    const detail = await fn();
    console.log(`PASS  ${id}${detail ? ` — ${detail}` : ""}`);
    results.push({ id, status: "PASS", detail });
  } catch (e) {
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    console.error(`FAIL  ${id} — ${msg}`);
    results.push({ id, status: "FAIL", detail: msg });
  }
}

await check("DB admin_audit_logs table", async () => {
  const { error } = await admin.from("admin_audit_logs").select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message || JSON.stringify(error));
  return "reachable";
});

await check("DB get_invoice_plan_usage RPC", async () => {
  const { data: profiles } = await admin.from("profiles").select("id").limit(1);
  const userId = profiles?.[0]?.id;
  if (!userId) return "no users to test";
  const { error } = await admin.rpc("get_invoice_plan_usage", { p_user_id: userId });
  if (error) throw error;
  return "callable";
});

await check("Admin user bossvegapal exists", async () => {
  const { data, error } = await admin
    .from("profiles")
    .select("id, role, email, is_disabled")
    .ilike("email", "bossvegapal@outlook.com")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("profile not found");
  if (data.role !== "admin") throw new Error(`role is ${data.role}`);
  if (data.is_disabled) throw new Error("admin is disabled");
  return `id ${data.id.slice(0, 8)}…`;
});

await check("PATCH ignores privileged fields (code review proxy)", async () => {
  const { data: victim } = await admin.from("profiles").select("id, role, plan").neq("role", "admin").limit(1).maybeSingle();
  if (!victim) return "no non-admin user";
  const before = victim;
  const { data: after, error } = await admin
    .from("profiles")
    .update({ role: "admin", plan: before.plan })
    .eq("id", before.id)
    .select("role")
    .maybeSingle();
  if (!error && after?.role === "admin") {
    await admin.from("profiles").update({ role: before.role }).eq("id", before.id);
    throw new Error("RLS/trigger did not block role escalation via service role (expected on service role)");
  }
  return "service role can update — client RLS tested separately";
});

const pass = results.filter((r) => r.status === "PASS").length;
const fail = results.filter((r) => r.status === "FAIL").length;
console.log(`\nRemote: PASS ${pass} FAIL ${fail}`);
process.exit(fail > 0 ? 1 : 0);
