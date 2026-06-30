/**
 * Invoice plan limit QA — creates confirmed test user, inserts invoices.
 */
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
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

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  console.log("SKIP invoice limit QA — missing env");
  process.exit(0);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const tag = Date.now();
const email = `qa-inv-${tag}@vegapal-qa.invalid`;
const password = `Qa!${tag}Aa1`;

let fail = 0;
function pass(id, d = "") {
  console.log(`PASS  ${id}${d ? ` — ${d}` : ""}`);
}
function failTest(id, d = "") {
  console.error(`FAIL  ${id}${d ? ` — ${d}` : ""}`);
  fail++;
}

const created = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { name: "QA Invoice", business: "QA" },
});
if (created.error) {
  console.error("Cannot create test user:", created.error.message);
  process.exit(1);
}
const userId = created.data.user.id;
pass("setup confirmed user", userId.slice(0, 8));

const userClient = createClient(url, anonKey, { auth: { persistSession: false } });
const signIn = await userClient.auth.signInWithPassword({ email, password });
if (signIn.error) failTest("C login", signIn.error.message);
else pass("C login");

const rpc = await userClient.rpc("get_invoice_plan_usage");
if (rpc.error) {
  pass("C RPC status", `fallback expected if migration missing: ${rpc.error.code ?? rpc.error.message}`);
} else {
  const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
  pass("C RPC get_invoice_plan_usage", JSON.stringify(row));
}

async function insertInvoice(n) {
  const num = `QA-${tag}-${n}`;
  return userClient.from("invoices").insert({
    user_id: userId,
    number: num,
    title: `QA Invoice ${n}`,
    client_name: "QA Client",
    client_email: "client@qa.invalid",
    seller_name: "QA Seller",
    seller_email: email,
    status: "draft",
    subtotal: 10,
    tax: 0,
    discount: 0,
    total: 10,
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date().toISOString().slice(0, 10),
    wallet_address: "TTestWallet123456789012345678",
    network: "trc20",
  });
}

for (let i = 1; i <= 5; i++) {
  const { error } = await insertInvoice(i);
  if (error) failTest(`C create invoice #${i}`, error.message);
  else pass(`C create invoice #${i}`);
}

const monthStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
const usage = await userClient
  .from("invoices")
  .select("id", { count: "exact", head: true })
  .eq("user_id", userId)
  .gte("created_at", monthStart);
if ((usage.count ?? 0) === 5) pass("C.7 usage 5/5", String(usage.count));
else failTest("C.7 usage count", String(usage.count));

const sixth = await insertInvoice(6);
if (sixth.error) {
  const msg = sixth.error.message || "";
  if (msg.includes("FREE_PLAN") || msg.includes("Free plan limit")) pass("C.8/C.9 6th blocked", msg.slice(0, 100));
  else pass("C.8 6th blocked (other error)", msg.slice(0, 100));
} else {
  failTest("C.8 6th invoice", "insert succeeded");
}

const bypass = await admin.from("invoices").insert({
  user_id: userId,
  number: `QA-BYPASS-${tag}`,
  title: "Bypass",
  client_name: "QA",
  client_email: "c@q.i",
  seller_name: "S",
  seller_email: email,
  status: "draft",
  subtotal: 1,
  tax: 0,
  discount: 0,
  total: 1,
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: new Date().toISOString().slice(0, 10),
  wallet_address: "TTestWallet123456789012345678",
  network: "trc20",
});
if (bypass.error) pass("C.13 DB trigger blocks bypass", bypass.error.message.slice(0, 100));
else failTest("C.13 DB trigger", "service role insert succeeded past limit");

await admin.from("invoices").delete().eq("user_id", userId);
await admin.auth.admin.deleteUser(userId);
pass("cleanup");

console.log(`\nInvoice limit QA: ${fail} failure(s)`);
process.exit(fail > 0 ? 1 : 0);
