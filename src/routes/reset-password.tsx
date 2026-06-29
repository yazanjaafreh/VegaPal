import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "./login";
import { supabase } from "@/integrations/supabase/client";
import { ensureNamespacesLoaded } from "@/lib/i18n/load-namespace";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { formatAuthError } from "@/lib/auth/errors";
import { firstZodError, resetPasswordSchema } from "@/lib/validation/schemas";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: () => ensureNamespacesLoaded(["auth"]),
  head: () => ({
    meta: [
      { title: "Set new password — VegaPal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError(t("resetPassword.invalidLink"));
    });
  }, [t]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(firstZodError(parsed.error, "confirmPassword"));
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: parsed.data.password,
      });
      if (updateError) throw updateError;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">{t("resetPassword.newPassword")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("resetPassword.passwordPlaceholder")}
            disabled={!ready}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("register.confirmPasswordPlaceholder")}
            disabled={!ready}
          />
        </div>
        <AuthFormError message={error} />
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading || !ready}>
          {loading ? t("resetPassword.updating") : t("resetPassword.updatePassword")}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t("resetPassword.backToSignIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
