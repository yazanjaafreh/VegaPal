# Database migration — manual run (required)

Automated `node scripts/run-migrations.mjs` could not connect: **password authentication failed** on the pooler (`aws-1-ap-south-1`). The REST API is live, but **no tables exist yet** (empty database).

## Run migrations in Supabase SQL Editor

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/rudqfhqawqmhclqmaflj/sql/new)
2. Paste the full contents of **`docs/MIGRATION_ALL.sql`**
3. Click **Run**
4. Confirm no errors

That file runs all 5 repository migrations in order (no schema changes beyond existing migration files).

## Optional: fix database password for CLI

1. **Project Settings → Database → Reset database password**
2. Add to `.env.local`:
   ```
   SUPABASE_DB_PASSWORD=your-new-password
   SUPABASE_DB_HOST=aws-1-ap-south-1.pooler.supabase.com
   ```
   (Use the **Session pooler** host from the dashboard if different.)
3. Run:
   ```bash
   node scripts/run-migrations.mjs
   node scripts/verify-supabase-sql.mjs
   node scripts/verify-supabase-infra.mjs
   ```

## After migrations

### Register migration history (optional, for Supabase CLI)

```sql
INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES
  ('20260624073831', '6545babe-9c15-45c1-91aa-19476cbe6545'),
  ('20260624073841', 'bdff3ce9-427f-42e7-830d-f852b5581113'),
  ('20260625120000', 'invoice_phase1'),
  ('20260626120000', 'tighten_public_invoice_rls'),
  ('20260627120000', 'admin_plans')
ON CONFLICT (version) DO NOTHING;
```

(Run only after `MIGRATION_ALL.sql` succeeds. The runner script creates this table automatically when using CLI.)

### First admin user

After you register and sign in once (creates a profile via `handle_new_user` trigger):

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### Auth redirect URLs

**Authentication → URL Configuration** — add:

- `http://localhost:5173/**`
- `https://vega-pal.com/**`
- `https://www.vega-pal.com/**`
- `https://*.vercel.app/**`

## Storage

No storage buckets are required. Logos are stored as data URLs in `profiles.logo_url`.
