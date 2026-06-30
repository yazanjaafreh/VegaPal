# Recommended future refactor: invoice creation API

## Current flow

```
React (invoices/new) → Supabase client → invoices + invoice_items tables
```

Validation and plan limits are split between the client (`vegapal-store.ts`) and database triggers.

## Recommended flow

```
React (invoices/new) → POST /api/invoices → Supabase (service role or user-scoped server client)
```

## Why centralize on the server

1. **Validation** — Single source of truth for required fields, amounts, and business rules.
2. **Plan limits** — Enforce Free (5/month), Pro, and Business rules before insert; return friendly errors.
3. **Logging** — Structured server logs for support and abuse detection (no sensitive data in the browser).
4. **Emails** — Send invoice / payment notifications from one place after create.
5. **Payments** — Hook payment provider or webhook handlers without exposing keys to the client.
6. **Webhooks** — Emit events (invoice.created, invoice.paid) for integrations.

## Suggested endpoint shape

- `POST /api/invoices` — create draft or pending invoice (authenticated, not disabled).
- `GET /api/invoices/:id` — optional server read for sensitive operations.
- Reuse existing RLS for reads; writes go through API with session verification mirroring `requireAdminFromRequest`.

## Migration approach

1. Implement `POST /api/invoices` with parity to current `invoices.create` in `vegapal-store.ts`.
2. Switch `invoices.new.tsx` to call the API; keep Supabase path behind a feature flag until verified.
3. Remove duplicate client-side limit checks once API + DB trigger both enforce limits.
4. Add integration tests for Free limit (5th OK, 6th blocked) and Pro unlimited.

Do **not** remove the database trigger until the API is proven in production — defense in depth.
