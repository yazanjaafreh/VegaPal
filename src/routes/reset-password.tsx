import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "./login";
import { supabase } from "@/integrations/supabase/client";
import { ensureNamespacesLoaded } from "@/lib/i18n/load-namespace";
import { FormError } from "@/components/ui/form-error";
import { completeAuthFromUrl } from "@/lib/auth/complete-auth-from-url";
import { formatAuthError } from "@/lib/auth/errors";
import { firstZodError, resetPasswordSchema } from "@/lib/validation/schemas";
import { useSubmitGuard } from "@/hooks/use-submit-guard";
import { AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: () => ensureNamespacesLoaded(["auth"]),
  head: () => ({
    meta: [{ title: "Set new password — VegaPal" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPassword,
});

type SessionState = "checking" | "ready" | "invalid";

function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const submitGuard = useSubmitGuard();

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      await completeAuthFromUrl();
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setSessionState("ready");
        return;
      }
      setSessionState("invalid");
      setError(t("resetPassword.invalidLink"));
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionState("ready");
        setError("");
      }
    });

    void checkSession();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [t]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionState !== "ready" || !submitGuard.begin()) return;
    setError("");

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(firstZodError(parsed.error, "confirmPassword"));
      submitGuard.end();
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
      submitGuard.end();
    }
  };

  if (sessionState === "checking") {
    return (
      <AuthLayout title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
        <div
          className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground"
          role="status"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
          <span>{t("resetPassword.checkingLink")}</span>
        </div>
      </AuthLayout>
    );
  }

  if (sessionState === "invalid") {
    return (
      <AuthLayout title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </div>
          <FormError message={error} />
          <Button asChild variant="hero" size="lg" className="w-full">
            <Link to="/forgot-password">{t("resetPassword.requestNewLink")}</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/login">{t("resetPassword.backToSignIn")}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="password">{t("resetPassword.newPassword")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("register.confirmPasswordPlaceholder")}
          />
        </div>
        <FormError message={error} />
        <LoadingButton
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {loading ? t("resetPassword.updating") : t("resetPassword.updatePassword")}
        </LoadingButton>
        <p className="text-sm text-muted-foreground text-center">
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t("resetPassword.backToSignIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
