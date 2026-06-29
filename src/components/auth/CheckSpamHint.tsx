import { useTranslation } from "react-i18next";

/** Shared hint under email confirmation / resend screens. */
export function CheckSpamHint({ className }: { className?: string }) {
  const { t } = useTranslation("auth");
  return (
    <p className={className ?? "text-xs text-muted-foreground text-center leading-relaxed"}>
      {t("confirmEmail.checkSpamFolder")}
    </p>
  );
}
