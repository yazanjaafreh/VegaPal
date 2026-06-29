import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/vegapal-store";

export function ConfirmEmailPending({ email }: { email?: string | null }) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const signOut = async () => {
    await auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mb-6">
          <Link to="/">
            <Logo className="mx-auto" />
          </Link>
        </div>
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Mail className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{t("confirmEmail.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("confirmEmail.message")}</p>
        {email ? (
          <p className="mt-3 text-sm font-medium text-foreground break-all">{email}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="outline" onClick={signOut}>
            {t("confirmEmail.backToSignIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
