/**
 * Infrastructure verification for Supabase migration (no app logic).
 * Usage: node scripts/verify-supabase-infra.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, "..", ".env.local"));
loadEnvFile(path.join(__dirname, "..", ".env.production"));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

async function rest(path, opts = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers, ...opts });
  return { res, body: res.headers.get("content-type")?.includes("json") ? await res.json().catch(() => null) : await res.text() };
}

async function authHealth() {
  const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
  return { ok: res.ok, status: res.status };
}

async function listBuckets() {
  const res = await fetch(`${url}/storage/v1/bucket`, { headers });
  const body = res.ok ? await res.json().catch(() => []) : await res.text();
  return { ok: res.ok, status: res.status, body };
}

async function openApiColumns(table) {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { ...headers, Accept: "application/openapi+json" },
  });
  if (!res.ok) return [];
  const spec = await res.json();
  const def = spec?.definitions?.[table] ?? spec?.components?.schemas?.[table];
  if (!def?.properties) return Object.keys(def?.properties ?? {});
  return Object.keys(def.properties);
}

const tables = ["profiles", "invoices", "invoice_items"];
const phase1Cols = [
  "invoice_currency",
  "po_number",
  "reference_number",
  "project_code",
  "terms_and_conditions",
  "display_options",
  "payment_methods",
];
const adminCols = ["plan", "role", "is_disabled"];

console.log("=== VegaPal Supabase infrastructure verification ===\n");

for (const table of tables) {
  const { res } = await rest(`${table}?select=*&limit=0`);
  console.log(`Table ${table}: ${res.ok ? "OK" : "FAIL"} (${res.status})`);
}

const invoiceCols = await openApiColumns("invoices");
const profileCols = await openApiColumns("profiles");

console.log("\n--- Invoice Phase 1 columns ---");
for (const col of phase1Cols) {
  console.log(`  ${col}: ${invoiceCols.includes(col) ? "OK" : "MISSING"}`);
}

console.log("\n--- Admin schema (profiles) ---");
for (const col of adminCols) {
  console.log(`  ${col}: ${profileCols.includes(col) ? "OK" : "MISSING"}`);
}

const auth = await authHealth();
console.log(`\nAuth health: ${auth.ok ? "OK" : "FAIL"} (${auth.status})`);

const buckets = await listBuckets();
console.log(`Storage buckets: ${buckets.ok ? "OK" : "FAIL"} (${buckets.status})`);
console.log(`  Count: ${Array.isArray(buckets.body) ? buckets.body.length : "n/a"}`);
if (Array.isArray(buckets.body) && buckets.body.length) {
  buckets.body.forEach((b) => console.log(`  - ${b.name ?? b.id}`));
} else {
  console.log("  (none — expected; logos use data URLs in profiles.logo_url)");
}

console.log("\nDone.");
