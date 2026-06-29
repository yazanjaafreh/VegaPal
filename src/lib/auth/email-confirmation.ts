import type { User } from "@supabase/supabase-js";

/** True when Supabase has marked the user's email as confirmed. */
export function isEmailConfirmed(user: Pick<User, "email_confirmed_at" | "confirmed_at"> | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.email_confirmed_at ?? user.confirmed_at);
}
