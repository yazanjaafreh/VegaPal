/**
 * Extended REST verification: RLS smoke tests + auth settings.
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

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const serviceHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
const anonHeaders = { apikey: publishableKey };

async function get(path, headers) {
  const res = await fetch(`${url}${path}`, { headers });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

console.log("=== Extended verification ===\n");

const authSettings = await get("/auth/v1/settings", { apikey: publishableKey });
console.log(`Auth settings: ${authSettings.status === 200 ? "OK" : "FAIL"} (${authSettings.status})`);

const anonProfiles = await get("/rest/v1/profiles?select=id&limit=1", anonHeaders);
console.log(
  `RLS anon profiles (expect 200 empty): ${anonProfiles.status === 200 ? "OK" : "FAIL"} (${anonProfiles.status})`,
);

const serviceProfiles = await get("/rest/v1/profiles?select=id,plan,role,is_disabled&limit=0", serviceHeaders);
console.log(`Service role profiles: ${serviceProfiles.status === 200 ? "OK" : "FAIL"} (${serviceProfiles.status})`);

const anonInvoices = await get("/rest/v1/invoices?select=id,status&limit=1", anonHeaders);
console.log(
  `RLS anon invoices (public read policy): ${anonInvoices.status === 200 ? "OK" : "FAIL"} (${anonInvoices.status})`,
);

const openApi = await get("/rest/v1/", { ...serviceHeaders, Accept: "application/openapi+json" });
const enums = openApi.body?.definitions?.user_plan?.enum ?? openApi.body?.components?.schemas?.user_plan?.enum;
console.log(`Enums user_plan: ${Array.isArray(enums) ? `OK (${enums.join(", ")})` : "check manually"}`);

console.log("\nDone.");
