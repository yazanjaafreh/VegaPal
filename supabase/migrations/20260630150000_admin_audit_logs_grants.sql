-- service_role needs table privileges (RLS alone is not enough for PostgREST).
GRANT ALL ON public.admin_audit_logs TO service_role;
