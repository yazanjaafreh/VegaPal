/** Hostnames where Cloudflare Turnstile must be enforced (production only). */
export const PRODUCTION_TURNSTILE_HOSTS = ["vega-pal.com", "www.vega-pal.com"] as const;

export function normalizeHostname(host: string): string {
  return host.split(":")[0].toLowerCase();
}

export function isPreviewOrLocalHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".lovable.app")
  );
}

export function isProductionTurnstileHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (PRODUCTION_TURNSTILE_HOSTS as readonly string[]).includes(host);
}

export type TurnstilePolicyContext = {
  hostname: string | null;
  vercelEnv?: string;
  viteDev?: boolean;
};

/**
 * Skip Turnstile outside production vega-pal.com — preview and local hosts are not
 * listed in the Cloudflare widget and show "Unable to connect to website".
 */
export function shouldBypassTurnstile(ctx: TurnstilePolicyContext): boolean {
  if (ctx.viteDev) return true;
  if (ctx.vercelEnv === "preview" || ctx.vercelEnv === "development") return true;
  if (!ctx.hostname) return true;
  if (isPreviewOrLocalHost(ctx.hostname)) return true;
  if (!isProductionTurnstileHost(ctx.hostname)) return true;
  return false;
}

export function clientTurnstilePolicy(): TurnstilePolicyContext {
  return {
    hostname: typeof window !== "undefined" ? window.location.hostname : null,
    viteDev: import.meta.env.DEV,
  };
}

export function serverTurnstilePolicy(hostHeader: string | null): TurnstilePolicyContext {
  return {
    hostname: hostHeader ? normalizeHostname(hostHeader) : null,
    vercelEnv: process.env.VERCEL_ENV,
    viteDev: false,
  };
}
