-- Admin audit logs: service-role writes only; no client policies (deny by default under RLS).
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX admin_audit_logs_target_user_id_idx ON public.admin_audit_logs (target_user_id);
CREATE INDEX admin_audit_logs_created_at_idx ON public.admin_audit_logs (created_at DESC);

COMMENT ON TABLE public.admin_audit_logs IS 'Admin actions audit trail. Access via service role / admin API only.';
