import { normalizeHostname } from "@/lib/turnstile/policy";

/** Canonical VegaPal site URL — used for all auth email redirects outside localhost. */
export const CANONICAL_SITE_URL = "https://vega-pal.com";

function isLocalDevHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/**
 * Origin for Supabase `emailRedirectTo` / `redirectTo`.
 *
 * - localhost → current origin (e.g. http://localhost:5173)
 * - production, preview, or any other host → https://vega-pal.com (never *.vercel.app)
 */
export function getAuthRedirectOrigin(): string {
  if (typeof window === "undefined") {
    return CANONICAL_SITE_URL;
  }

  if (isLocalDevHost(window.location.hostname)) {
    return window.location.origin;
  }

  return CANONICAL_SITE_URL;
}

export function getEmailConfirmRedirectUrl(): string {
  return `${getAuthRedirectOrigin()}/dashboard`;
}

export function getPasswordResetRedirectUrl(): string {
  return `${getAuthRedirectOrigin()}/reset-password`;
}

/** Dev-only: log the redirect URL chosen during signup/resend for debugging. */
export function logAuthRedirect(
  context: "signUp" | "resend" | "resetPassword",
  url: string,
): void {
  if (!import.meta.env.DEV) return;
  const hostname = typeof window !== "undefined" ? window.location.hostname : "ssr";
  console.debug(`[auth] ${context} emailRedirectTo=${url} (host=${hostname})`);
}
