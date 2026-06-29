import type { AuthError, EmailOtpType, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logAuthDebug } from "@/lib/auth/debug";

export type PasswordRecoveryResult = {
  ok: boolean;
  step: string;
  error?: AuthError | Error | null;
  hasSession?: boolean;
};

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
  logAuthDebug("recovery", {
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
      logAuthDebug("recovery", { event, hasSession: !!session });
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
  logAuthDebug(step, {
    hasSession: !!data.session,
    error: error?.message ?? null,
    code: error?.code ?? null,
  });
  return data.session;
}

/** Parse implicit-flow hash tokens when detectSessionInUrl has not run yet. */
async function trySetSessionFromHash(step: string): Promise<Session | null> {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.includes("access_token=")) return null;

  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  logAuthDebug(step, {
    hasSession: !!data.session,
    error: error?.message ?? null,
    code: error?.code ?? null,
  });
  if (error || !data.session) return null;
  return data.session;
}

async function waitForSession(step: string, attempts = 4): Promise<Session | null> {
  const delays = [0, 100, 250, 500];
  for (let i = 0; i < attempts; i++) {
    const delay = delays[i] ?? 500;
    if (delay > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }
    const session = await readSession(`${step}.attempt${i + 1}`);
    if (session) return session;
  }
  return null;
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
    logAuthDebug("confirm.verifyOtp", {
      hasSession: !!data.session,
      error: error?.message ?? null,
      code: error?.code ?? null,
    });
    if (!error && data.session) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  if (hasHashAccessToken()) {
    const fromHash = await trySetSessionFromHash("confirm.setSession");
    if (fromHash) {
      stripAuthParamsFromUrl();
      return true;
    }
  }

  const session = await waitForSession("confirm.getSession", 3);
  if (session) {
    if (hasUrlAuthCallback()) stripAuthParamsFromUrl();
    return true;
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    logAuthDebug("confirm.exchangeCodeForSession", {
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
 * Implicit hash tokens first; token_hash verifyOtp second; PKCE code exchange last.
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
    logAuthDebug("recovery", { redirectError });
    return {
      ok: false,
      step: "redirectError",
      error: new Error(redirectError),
    };
  }

  const waitForEvent = createRecoveryListener();

  if (hasHashAccessToken()) {
    const fromHash = await trySetSessionFromHash("recovery.setSession");
    if (fromHash) {
      stripAuthParamsFromUrl();
      return { ok: true, step: "setSession.fromHash", hasSession: true };
    }
  }

  let session = await waitForSession("recovery.getSession", 3);
  if (session) {
    stripAuthParamsFromUrl();
    return { ok: true, step: "getSession", hasSession: true };
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    logAuthDebug("recovery.verifyOtp", {
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
  logAuthDebug("recovery", { waitForRecoveryEvent: eventReceived });
  session = await readSession("recovery.getSession.afterEvent");
  if (session) {
    stripAuthParamsFromUrl();
    return { ok: true, step: "authStateChange", hasSession: true };
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    logAuthDebug("recovery.exchangeCodeForSession", {
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
