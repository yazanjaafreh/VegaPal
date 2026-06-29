import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailConfirmationActions } from "@/components/auth/EmailConfirmationActions";
import { CheckSpamHint } from "@/components/auth/CheckSpamHint";

type RegisterSuccessPanelProps = {
  email: string;
};

export function RegisterSuccessPanel({ email }: RegisterSuccessPanelProps) {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <MailCheck className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">
          {t("register.checkEmailTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t("register.successMessage")}
        </p>
        <CheckSpamHint className="mt-3 text-xs text-muted-foreground leading-relaxed" />
        {email ? (
          <p className="mt-4 text-sm break-all">
            <span className="text-muted-foreground">{tc("labels.email")}: </span>
            <span className="font-medium text-foreground">{email}</span>
          </p>
        ) : null}
      </div>

      <EmailConfirmationActions email={email} />

      <Button asChild variant="ghost" size="lg" className="w-full">
        <Link to="/login">{t("register.backToSignIn")}</Link>
      </Button>
    </div>
  );
}
