import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/vegapal-store";
import { AuthLayout } from "./login";
import { forgotPasswordSchema, firstZodError } from "@/lib/validation/schemas";
import { checkClientRateLimit } from "@/lib/client-rate-limit";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { formatAuthError } from "@/lib/auth/errors";
import { useTurnstile } from "@/hooks/use-turnstile";
import { ensureNamespacesLoaded } from "@/lib/i18n/load-namespace";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: () => ensureNamespacesLoaded(["auth"]),
  head: () => ({
    meta: [
      { title: "Reset password — VegaPal" },
      { name: "description", content: "Reset your VegaPal account password securely." },
      { name: "robots", content: "noindex" },
    ],
  }),
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
  const turnstile = useTurnstile();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(firstZodError(parsed.error));
      return;
    }

    const rate = checkClientRateLimit("forgot-password", 5, 15 * 60_000);
    if (!rate.allowed) {
      setError(`Too many attempts. Try again in ${rate.retryAfterSec} seconds.`);
      return;
    }

    setLoading(true);
    try {
      await turnstile.verifyBeforeAuth();
      await auth.resetPassword(parsed.data.email.toLowerCase());
      setSent(true);
    } catch (err) {
      turnstile.reset();
      setError(formatAuthError(err));
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
          <AuthFormError message={error} />
          {turnstile.enabled && (
            <TurnstileWidget
              onToken={turnstile.setToken}
              resetRef={turnstile.resetRef}
              onExpire={() => turnstile.setToken("")}
            />
          )}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading || (turnstile.enabled && !turnstile.token)}
          >
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
