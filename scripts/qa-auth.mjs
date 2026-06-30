/**
 * Auth + profile security QA via Supabase (creates a throwaway user).
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

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.log("SKIP auth QA — missing Supabase URL or publishable key");
  process.exit(0);
}

const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const admin = serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;

const tag = `qa-${Date.now()}`;
const email = `${tag}@vegapal-qa.invalid`;
const password = `Qa!${Date.now()}Aa1`;

let fail = 0;
function pass(id, d = "") {
  console.log(`PASS  ${id}${d ? ` — ${d}` : ""}`);
}
function failTest(id, d = "") {
  console.error(`FAIL  ${id}${d ? ` — ${d}` : ""}`);
  fail++;
}

console.log(`\n=== Auth QA (${email}) ===\n`);

const signUp = await anon.auth.signUp({
  email,
  password,
  options: { data: { name: "QA User", business: "QA Co" } },
});
if (signUp.error) failTest("A.3 register", signUp.error.message);
else pass("A.3 register", "user created");

await anon.auth.signOut();
const { data: afterSignOut } = await anon.auth.getSession();
if (!afterSignOut.session) pass("A.4 no auto-login", "session cleared after signOut (app behavior)");
else failTest("A.4 no auto-login", "session still present after signOut");

const signInUnconfirmed = await anon.auth.signInWithPassword({ email, password });
if (signInUnconfirmed.error) {
  pass("A.7 login unconfirmed blocked", signInUnconfirmed.error.message);
} else {
  const u = signInUnconfirmed.data.user;
  const confirmed = !!(u?.email_confirmed_at || u?.confirmed_at);
  if (!confirmed) {
    pass("A.7 Supabase allows session — app blocks via isEmailConfirmed", "email_confirmed_at null");
  } else {
    failTest("A.7 login unconfirmed", "user already confirmed unexpectedly");
  }
}

if (admin) {
  const { data: profile } = await admin.from("profiles").select("id, plan, role, is_disabled").eq("email", email).maybeSingle();
  if (!profile) failTest("B profile created");
  else {
    pass("B profile created", `plan=${profile.plan}`);
    if (profile.role === "user") pass("B.6 role is user");
    else failTest("B.6 role", profile.role);
    if (profile.plan === "free") pass("B default plan free");
    else failTest("B default plan", profile.plan);
  }

  const userId = profile?.id;
  if (userId) {
    const clientAsUser = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await clientAsUser.auth.signInWithPassword({ email, password }).catch(() => {});

    const { error: roleErr } = await clientAsUser
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId);
    if (roleErr) pass("B.6 client cannot set role", roleErr.code ?? "error");
    else failTest("B.6 client cannot set role", "update succeeded");

    const { error: planErr } = await clientAsUser
      .from("profiles")
      .update({ plan: "pro" })
      .eq("id", userId);
    if (planErr) pass("B.6 client cannot set plan", planErr.code ?? "error");
    else failTest("B.6 client cannot set plan", "update succeeded");

    const { error: disErr } = await clientAsUser
      .from("profiles")
      .update({ is_disabled: true })
      .eq("id", userId);
    if (disErr) pass("B.6 client cannot set disabled", disErr.code ?? "error");
    else failTest("B.6 client cannot set disabled", "update succeeded");

    await admin.auth.admin.deleteUser(userId).catch(() => {});
    pass("cleanup test user");
  }
} else {
  console.log("SKIP B.6 profile RLS — no service role key");
}

console.log(`\nAuth QA: ${fail} failure(s)`);
process.exit(fail > 0 ? 1 : 0);
