import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/vegapal-store";
import { AuthLayout } from "./login";
import { registerSchema, firstZodError } from "@/lib/validation/schemas";
import { checkClientRateLimit } from "@/lib/client-rate-limit";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — VegaPal" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse({
      name,
      business,
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      setError(firstZodError(parsed.error));
      return;
    }

    const rate = checkClientRateLimit("register", 5, 15 * 60_000);
    if (!rate.allowed) {
      setError(`Too many attempts. Try again in ${rate.retryAfterSec} seconds.`);
      return;
    }

    setLoading(true);
    try {
      const data = parsed.data;
      await auth.signUp(
        data.email.toLowerCase(),
        data.password,
        data.name,
        data.business || undefined,
      );
      try {
        await auth.signIn(data.email.toLowerCase(), data.password);
      } catch {
        /* ignore */
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("register.title")} subtitle={t("register.subtitle")}>
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">{tc("labels.name")}</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("register.namePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">
            {t("register.businessName")}{" "}
            <span className="text-muted-foreground font-normal">({tc("labels.optional")})</span>
          </Label>
          <Input
            id="business"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder={t("register.businessPlaceholder")}
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">{tc("labels.password")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("register.passwordPlaceholder")}
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
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? t("register.creatingAccount") : t("register.createAccount")}
        </Button>
        <p className="text-xs text-muted-foreground text-center">{t("register.termsNotice")}</p>
        <p className="text-sm text-muted-foreground text-center">
          {t("register.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            {t("register.signIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
