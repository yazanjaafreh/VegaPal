# Disabled user handling

When an admin disables a user, VegaPal applies **two layers**:

## 1. Profile flag (`profiles.is_disabled = true`)

Enforced in:

- Sign-in (`auth.signIn` checks profile before session is accepted).
- Session refresh (`useSession` signs out if disabled).
- Invoice creation (`invoices.create` blocks disabled accounts).
- Admin gate (`requireAdminFromRequest` rejects disabled admins).

This is the primary enforcement path and works even if Auth ban fails.

## 2. Supabase Auth ban (best effort)

After a successful profile update, the admin API calls:

```ts
supabaseAdmin.auth.admin.updateUserById(userId, {
  ban_duration: isDisabled ? "876000h" : "none",
});
```

- **Disable** — long ban (~100 years) invalidates existing sessions and blocks new sign-in.
- **Enable** — `ban_duration: "none"` removes the ban.

If the Auth Admin API call fails (misconfiguration, rate limit, etc.), the profile flag still blocks access. Failures are logged server-side only (`[admin-api] auth ban failed`).

## Why both

- Profile flag: fast RLS-friendly check, works with app logic and triggers.
- Auth ban: immediately invalidates JWT sessions so a disabled user cannot keep using an old token until expiry.
