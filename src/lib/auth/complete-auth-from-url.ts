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

/**
 * Complete email confirmation / recovery from URL before session guards run.
 * Handles PKCE `?code=`, implicit hash tokens, and `token_hash` verify links.
 */
export async function completeAuthFromUrl(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  const hash = window.location.hash.replace(/^#/, "");
  if (hash.includes("access_token=")) {
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
  const url = new URL(window.location.href);
  if (url.searchParams.has("code") || url.searchParams.has("token_hash")) return true;
  return window.location.hash.includes("access_token=");
}
