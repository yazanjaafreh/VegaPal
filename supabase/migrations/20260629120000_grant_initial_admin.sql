-- Grant initial admin when no admin account exists yet.
-- Safe to re-run: skips if any active admin profile already exists.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE role = 'admin'
      AND NOT is_disabled
  ) THEN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE lower(trim(email)) = lower('bossvegapal@outlook.com');

    IF NOT FOUND THEN
      RAISE NOTICE 'No profile for bossvegapal@outlook.com — register and sign in once, then run: UPDATE public.profiles SET role = ''admin'' WHERE lower(email) = lower(''bossvegapal@outlook.com'');';
    END IF;
  END IF;
END $$;
