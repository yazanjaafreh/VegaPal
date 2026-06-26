import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/vegapal-store";
import { ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — VegaPal" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.signIn(email.trim().toLowerCase(), password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("login.title")} subtitle={t("login.subtitle")}>
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{tc("labels.password")}</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder")}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? t("login.signingIn") : t("login.signIn")}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          {t("login.newToVegapal")}{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            {t("login.createAccount")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-hero relative overflow-hidden p-12 flex-col justify-between text-navy-foreground">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative"><Link to="/"><Logo light size="auth" /></Link></div>
        <div className="relative max-w-md">
          <ShieldCheck className="h-10 w-10 text-primary mb-6" />
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            {t("panel.headlineLine1")}
            <br />
            {t("panel.headlineLine2")}
          </h2>
          <p className="mt-3 text-navy-foreground/70">{t("panel.description")}</p>
        </div>
        <div className="relative text-sm text-navy-foreground/50">
          {t("panel.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background relative min-w-0">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm min-w-0 px-1">
          <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
