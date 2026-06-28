-- Admin roles, subscription plans, and account status on profiles.

CREATE TYPE public.user_plan AS ENUM ('free', 'pro', 'business');
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan public.user_plan NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS role public.user_role NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT false;

-- Block authenticated users from changing privileged fields on their own row.
-- Service-role updates (auth.uid() IS NULL) are allowed for admin API handlers.
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.id THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Cannot change role';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
      RAISE EXCEPTION 'Cannot change plan';
    END IF;
    IF NEW.is_disabled IS DISTINCT FROM OLD.is_disabled THEN
      RAISE EXCEPTION 'Cannot change account status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_privileged_fields ON public.profiles;
CREATE TRIGGER profiles_protect_privileged_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Grant admin access manually after migration, e.g.:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
