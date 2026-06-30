function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleHealthCheckRequest(): Promise<Response> {
  const env = {
    supabaseUrl: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    supabasePublishableKey: !!(
      process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ),
    supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    turnstileSecretKey: !!process.env.TURNSTILE_SECRET_KEY,
    turnstileSiteKey: !!(process.env.VITE_TURNSTILE_SITE_KEY),
  };

  let supabaseReachable = false;
  if (env.supabaseUrl && env.supabaseServiceRoleKey) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).limit(1);
      supabaseReachable = !error;
    } catch {
      supabaseReachable = false;
    }
  }

  const requiredEnvOk = Object.values(env).every(Boolean);

  return json({
    ok: requiredEnvOk && supabaseReachable,
    app: "ok",
    supabase: supabaseReachable,
    env,
  });
}
