import {
  isPreviewOrLocalHost,
  isProductionTurnstileHost,
  normalizeHostname,
} from "@/lib/turnstile/policy";

/** Canonical production origin for auth email links — never a Vercel preview URL. */
export const PRODUCTION_AUTH_ORIGIN = "https://vega-pal.com";

/**
 * Origin used in Supabase `emailRedirectTo` / `redirectTo`.
 *
 * Production (vega-pal.com): always https://vega-pal.com — even on www or alias hosts.
 * Preview (*.vercel.app): current preview origin only.
 * Local: current origin (localhost).
 */
export function getAuthRedirectOrigin(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const hostname = normalizeHostname(window.location.hostname);

  if (isProductionTurnstileHost(hostname)) {
    return PRODUCTION_AUTH_ORIGIN;
  }

  if (isPreviewOrLocalHost(hostname)) {
    return window.location.origin;
  }

  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  if (configured?.trim()) {
    try {
      return new URL(configured.trim()).origin;
    } catch {
      /* ignore invalid VITE_SITE_URL */
    }
  }

  return window.location.origin;
}

export function getEmailConfirmRedirectUrl(): string | undefined {
  const origin = getAuthRedirectOrigin();
  return origin ? `${origin}/dashboard` : undefined;
}

export function getPasswordResetRedirectUrl(): string | undefined {
  const origin = getAuthRedirectOrigin();
  return origin ? `${origin}/reset-password` : undefined;
}

/** Dev-only: log the redirect URL chosen during signup/resend for debugging. */
export function logAuthRedirect(
  context: "signUp" | "resend" | "resetPassword",
  url: string | undefined,
): void {
  if (!import.meta.env.DEV || !url) return;
  const hostname = typeof window !== "undefined" ? window.location.hostname : "ssr";
  console.debug(`[auth] ${context} emailRedirectTo=${url} (host=${hostname})`);
}
