import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

function stripAuthParamsFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");
  url.hash = "";
  const next = `${url.pathname}${url.search}`;
  window.history.replaceState({}, "", next || "/");
}

function hasUrlAuthCallback(): boolean {
  const url = new URL(window.location.href);
  if (url.searchParams.has("code") || url.searchParams.has("token_hash")) return true;
  return window.location.hash.includes("access_token=");
}

/**
 * Complete email confirmation / recovery from URL before session guards run.
 * Handles PKCE `?code=`, implicit hash tokens, and `token_hash` verify links.
 */
export async function completeAuthFromUrl(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  if (window.location.hash.includes("access_token=")) {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  return false;
}

export function hasPendingAuthCallback(): boolean {
  if (typeof window === "undefined") return false;
  return hasUrlAuthCallback();
}

/** Wait for Supabase to emit a recovery/sign-in session (after URL token exchange). */
export function waitForRecoverySession(timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      sub.subscription.unsubscribe();
      clearTimeout(timer);
      resolve(ok);
    };

    const {
      data: { subscription: sub },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        finish(true);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(true);
    });

    const timer = setTimeout(() => finish(false), timeoutMs);
  });
}

/**
 * Establish a password-recovery session from the email link before showing the reset form.
 */
export async function establishPasswordRecoverySession(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (hasUrlAuthCallback()) {
    const completed = await completeAuthFromUrl();
    if (completed) return true;
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) return true;

  if (hasUrlAuthCallback()) {
    return waitForRecoverySession();
  }

  return false;
}
