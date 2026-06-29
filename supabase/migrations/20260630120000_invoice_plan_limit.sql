-- Enforce Free plan monthly invoice limit (5) at the database layer.

CREATE OR REPLACE FUNCTION public.count_user_invoices_this_month(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.invoices
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('month', timezone('UTC', now()))
    AND created_at < date_trunc('month', timezone('UTC', now())) + interval '1 month';
$$;

CREATE OR REPLACE FUNCTION public.enforce_invoice_plan_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_plan public.user_plan;
  monthly_count integer;
BEGIN
  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;

  IF user_plan = 'free' THEN
    monthly_count := public.count_user_invoices_this_month(NEW.user_id);
    IF monthly_count >= 5 THEN
      RAISE EXCEPTION 'FREE_PLAN_INVOICE_LIMIT'
        USING MESSAGE = 'You have reached the Free plan limit of 5 invoices this month. Upgrade to Pro to create unlimited invoices.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoices_enforce_plan_limit ON public.invoices;
CREATE TRIGGER invoices_enforce_plan_limit
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_invoice_plan_limit();

CREATE OR REPLACE FUNCTION public.get_invoice_plan_usage()
RETURNS TABLE (
  plan public.user_plan,
  invoices_this_month integer,
  monthly_limit integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(p.plan, 'free'::public.user_plan),
    public.count_user_invoices_this_month(auth.uid()),
    CASE WHEN COALESCE(p.plan, 'free') = 'free' THEN 5 ELSE NULL END
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.count_user_invoices_this_month(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_invoice_plan_limit() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_invoice_plan_usage() TO authenticated;
