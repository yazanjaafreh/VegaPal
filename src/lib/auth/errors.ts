import type { AuthError } from "@supabase/supabase-js";
import type { z } from "zod";

const FALLBACK = "Something went wrong. Please try again.";

/** Never render raw objects — coerce any value to a safe display string. */
export function toDisplayString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "{}" || trimmed === "[object Object]") return "";
    return trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Error) return toDisplayString(value.message) || FALLBACK;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.message === "string") {
      const fromMessage = toDisplayString(record.message);
      if (fromMessage) return fromMessage;
    }
    if (typeof record.error === "string") {
      const fromError = toDisplayString(record.error);
      if (fromError) return fromError;
    }
    if (Array.isArray(record._errors) && record._errors.length > 0) {
      const fromErrors = toDisplayString(record._errors[0]);
      if (fromErrors) return fromErrors;
    }
    const code = typeof record.code === "string" ? record.code : undefined;
    if (code) {
      const fromCode = mapSupabaseAuthCode(code);
      if (fromCode) return fromCode;
    }
  }
  return "";
}

const SUPABASE_AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Please confirm your email before signing in.",
  user_already_exists: "An account with this email already exists. Try signing in instead.",
  email_exists: "An account with this email already exists. Try signing in instead.",
  signup_disabled: "Registration is temporarily unavailable. Please try again later.",
  weak_password: "Password is too weak. Use at least 6 characters.",
  same_password: "Choose a new password that is different from your current one.",
  over_request_rate_limit: "Too many attempts. Please wait a few minutes and try again.",
  user_not_found: "No account found with that email address.",
  validation_failed: "Please check your details and try again.",
  session_not_found: "Your session has expired. Please sign in again.",
  flow_state_expired: "This link has expired. Please request a new one.",
  request_timeout: "The request timed out. Check your connection and try again.",
};

function mapSupabaseAuthCode(code: string): string | undefined {
  return SUPABASE_AUTH_MESSAGES[code];
}

function mapSupabaseAuthMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return SUPABASE_AUTH_MESSAGES.user_already_exists;
  }
  if (lower.includes("invalid login credentials")) {
    return SUPABASE_AUTH_MESSAGES.invalid_credentials;
  }
  if (lower.includes("password should be at least") || lower.includes("weak password")) {
    return SUPABASE_AUTH_MESSAGES.weak_password;
  }
  if (lower.includes("email not confirmed")) {
    return SUPABASE_AUTH_MESSAGES.email_not_confirmed;
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Network error. Check your connection and try again.";
  }
  if (lower.includes("captcha")) {
    return "Captcha verification failed. Please try again.";
  }
  return message;
}

/** Map Supabase auth errors, network failures, and thrown values to user-facing text. */
export function formatAuthError(err: unknown): string {
  if (!err) return FALLBACK;

  const direct = toDisplayString(err);
  if (direct && direct !== FALLBACK) {
    return mapSupabaseAuthMessage(direct);
  }

  if (typeof err === "object" && err !== null) {
    const authErr = err as AuthError;
    if (typeof authErr.code === "string") {
      const fromCode = mapSupabaseAuthCode(authErr.code);
      if (fromCode) return fromCode;
    }
    if (typeof authErr.message === "string" && authErr.message.trim()) {
      return mapSupabaseAuthMessage(authErr.message.trim());
    }
  }

  return FALLBACK;
}

function issueToString(issue: z.ZodIssue): string {
  const raw = issue.message;
  if (typeof raw === "string" && raw.trim()) return raw.trim();

  switch (issue.code) {
    case "invalid_string":
      if (issue.validation === "email") return "Enter a valid email address.";
      return "Invalid value.";
    case "too_small":
      if (issue.type === "string") {
        return issue.minimum === 1
          ? `${String(issue.path[0] ?? "This field")} is required.`
          : `Must be at least ${issue.minimum} characters.`;
      }
      return "Value is too small.";
    case "too_big":
      return "Value is too long.";
    case "custom":
      return "Please check your input.";
    default:
      return "";
  }
}

export function zodErrorForField(error: z.ZodError, field: string): string | undefined {
  const issue = error.issues.find((i) => i.path[0] === field);
  if (!issue) return undefined;
  const text = issueToString(issue);
  return text || undefined;
}

/** Prefer a field-specific message (e.g. confirmPassword), then first issue. */
export function formatZodError(error: z.ZodError, preferredField?: string): string {
  if (preferredField) {
    const fieldMsg = zodErrorForField(error, preferredField);
    if (fieldMsg) return fieldMsg;
  }
  for (const issue of error.issues) {
    const text = issueToString(issue);
    if (text) return text;
  }
  return "Please check your input.";
}
