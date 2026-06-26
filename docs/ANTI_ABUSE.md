# Anti-abuse & rate limiting (manual setup)

VegaPal is a frontend + Supabase app. **Server-side rate limits are the real protection.**

## Already in app (client-side, soft)

- `src/lib/client-rate-limit.ts` throttles register, login, and forgot-password submissions in the browser (easy to bypass — UX guard only).

## Recommended: Supabase Auth

In [Supabase Dashboard → Authentication → Rate Limits](https://supabase.com/docs/guides/auth/rate-limits):

- Enable built-in email signup / sign-in / password recovery limits.
- Set sensible per-IP thresholds for production traffic.

## Cloudflare Turnstile (implemented)

Set in Vercel / local env:

- `VITE_TURNSTILE_SITE_KEY` — public site key (widget on register, login, forgot-password)
- `TURNSTILE_SECRET_KEY` — server only; verified at `POST /api/turnstile/verify` before Supabase auth

If keys are omitted locally, auth works without captcha (dev convenience). In production, set both keys.

## Recommended: Vercel

- Enable **Vercel Firewall / WAF** on Pro plan for `/register`, `/login`, `/forgot-password`.
- Set deployment **Attack Challenge Mode** if under bot traffic.

## Invoice creation

- Supabase RLS already scopes writes to `auth.uid()`.
- Add Edge Function rate limit (e.g. max N invoices/hour per user) if abuse appears.
- Consider captcha on register only (highest ROI).

## Public pay page

- RLS now blocks **draft** invoices from anonymous reads (migration `20260626120000`).
- UUID links remain guessable — do not treat invoice UUID as a secret; use long random IDs or tokens if stricter privacy is required later.
