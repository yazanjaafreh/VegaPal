import type { AuthError, EmailOtpType, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type PasswordRecoveryResult = {
  ok: boolean;
  step: string;
  error?: AuthError | Error | null;
  hasSession?: boolean;
};

function logRecovery(step: string, detail: Record<string, unknown>): void {
  console.info(`[auth:recovery] ${step}`, detail);
}

function readAuthCallbackUrl(): URL {
  return new URL(window.location.href);
}

function stripAuthParamsFromUrl(): void {
  const url = readAuthCallbackUrl();
  url.searchParams.delete("code");
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");
  url.searchParams.delete("error");
  url.searchParams.delete("error_code");
  url.searchParams.delete("error_description");
  url.hash = "";
  const next = `${url.pathname}${url.search}`;
  window.history.replaceState({}, "", next || "/");
}

function hasHashAccessToken(): boolean {
  return window.location.hash.includes("access_token=");
}

function hasPkceCode(): boolean {
  return readAuthCallbackUrl().searchParams.has("code");
}

function hasTokenHash(): boolean {
  return readAuthCallbackUrl().searchParams.has("token_hash");
}

function hasUrlAuthCallback(): boolean {
  if (typeof window === "undefined") return false;
  return hasPkceCode() || hasTokenHash() || hasHashAccessToken();
}

function isResetPasswordRoute(): boolean {
  return typeof window !== "undefined" && window.location.pathname === "/reset-password";
}

function logUrlSnapshot(): void {
  const url = readAuthCallbackUrl();
  logRecovery("url", {
    pathname: url.pathname,
    hasCode: url.searchParams.has("code"),
    hasTokenHash: url.searchParams.has("token_hash"),
    type: url.searchParams.get("type"),
    hasHashAccessToken: hasHashAccessToken(),
    error: url.searchParams.get("error"),
    errorDescription: url.searchParams.get("error_description"),
  });
}

function createRecoveryListener(timeoutMs = 8000) {
  let settled = false;

  const waitPromise = new Promise<boolean>((resolve) => {
    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeoutMs);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logRecovery("onAuthStateChange", { event, hasSession: !!session });
      if (!session || settled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        settled = true;
        window.clearTimeout(timer);
        subscription.unsubscribe();
        resolve(true);
      }
    });
  });

  return waitPromise;
}

async function readSession(step: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  logRecovery(step, {
    hasSession: !!data.session,
    error: error?.message ?? null,
    code: error?.code ?? null,
  });
  return data.session;
}

/**
 * Complete signup/email-confirmation callbacks (not password recovery).
 * Skipped on /reset-password — that route uses establishPasswordRecoverySession().
 */
export async function completeAuthFromUrl(): Promise<boolean> {
  if (typeof window === "undefined" || isResetPasswordRoute()) return false;

  const url = readAuthCallbackUrl();
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    logRecovery("completeAuthFromUrl.verifyOtp", {
      hasSession: !!data.session,
      error: error?.message ?? null,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  const session = await readSession("completeAuthFromUrl.getSession");
  if (session) {
    if (hasUrlAuthCallback()) stripAuthParamsFromUrl();
    return true;
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    logRecovery("completeAuthFromUrl.exchangeCodeForSession", {
      hasSession: !!data.session,
      error: error?.message ?? null,
      code: error?.code ?? null,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  return false;
}

export function hasPendingAuthCallback(): boolean {
  return hasUrlAuthCallback();
}

/**
 * Establish a password-recovery session from the email link.
 * Uses implicit hash tokens (detectSessionInUrl) first; PKCE code exchange is last resort.
 */
export async function establishPasswordRecoverySession(): Promise<PasswordRecoveryResult> {
  if (typeof window === "undefined") {
    return { ok: false, step: "ssr", error: new Error("Password recovery requires a browser") };
  }

  logUrlSnapshot();

  const url = readAuthCallbackUrl();
  const redirectError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (redirectError) {
    logRecovery("redirectError", { redirectError });
    return {
      ok: false,
      step: "redirectError",
      error: new Error(redirectError),
    };
  }

  const waitForEvent = createRecoveryListener();

  let session = await readSession("getSession.initial");
  if (session) {
    stripAuthParamsFromUrl();
    return { ok: true, step: "getSession.initial", hasSession: true };
  }

  if (hasHashAccessToken()) {
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    session = await readSession("getSession.afterHashDelay");
    if (session) {
      stripAuthParamsFromUrl();
      return { ok: true, step: "hash.detectSessionInUrl", hasSession: true };
    }
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    logRecovery("verifyOtp", {
      type,
      hasSession: !!data.session,
      error: error?.message ?? null,
      code: error?.code ?? null,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return { ok: true, step: "verifyOtp", hasSession: true };
    }
    if (error) {
      return { ok: false, step: "verifyOtp", error };
    }
  }

  const eventReceived = await waitForEvent;
  logRecovery("waitForRecoveryEvent", { eventReceived });
  session = await readSession("getSession.afterEvent");
  if (session) {
    stripAuthParamsFromUrl();
    return { ok: true, step: "authStateChange", hasSession: true };
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    logRecovery("exchangeCodeForSession", {
      hasSession: !!data.session,
      error: error?.message ?? null,
      code: error?.code ?? null,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return { ok: true, step: "exchangeCodeForSession", hasSession: true };
    }
    return { ok: false, step: "exchangeCodeForSession", error: error ?? undefined };
  }

  if (!hasUrlAuthCallback()) {
    return {
      ok: false,
      step: "noCallbackParams",
      error: new Error("No password recovery token found in URL"),
    };
  }

  return {
    ok: false,
    step: "exhausted",
    error: new Error("Password recovery session could not be established"),
  };
}
