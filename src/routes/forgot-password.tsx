import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/vegapal-store";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — VegaPal" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.resetPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("forgotPassword.title")} subtitle={t("forgotPassword.subtitle")}>
      {sent ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm">
              <Trans
                i18nKey="forgotPassword.checkInbox"
                ns="auth"
                values={{ email }}
                components={{ strong: <strong /> }}
              />
            </p>
            <p className="text-xs text-muted-foreground mt-2">{t("forgotPassword.followLink")}</p>
          </div>
          <Button onClick={() => navigate({ to: "/login" })} variant="hero" className="w-full">
            {t("forgotPassword.backToSignIn")}
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{tc("labels.email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("register.emailPlaceholder")}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? t("forgotPassword.sending") : t("forgotPassword.sendResetLink")}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {t("forgotPassword.remembered")}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t("forgotPassword.signIn")}
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
