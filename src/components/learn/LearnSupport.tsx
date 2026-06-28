import { Mail } from "lucide-react";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import {
  VEGAPAL_SUPPORT_AVAILABILITY,
  VEGAPAL_SUPPORT_EMAIL,
  VEGAPAL_SUPPORT_EMAIL_HREF,
  VEGAPAL_SUPPORT_TELEGRAM_HANDLE,
  VEGAPAL_SUPPORT_TELEGRAM_HREF,
  VEGAPAL_SUPPORT_TRUST,
} from "@/lib/support-contact";

export function LearnSupport() {
  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8" aria-labelledby="learn-support-heading">
      <h2 id="learn-support-heading" className="text-2xl font-bold tracking-tight text-foreground">
        Need help?
      </h2>
      <p className="mt-2 text-muted-foreground">{VEGAPAL_SUPPORT_AVAILABILITY}</p>
      <p className="mt-4 text-sm font-medium text-foreground">Support methods:</p>
      <ul className="mt-3 space-y-3 text-sm">
        <li>
          <a
            href={VEGAPAL_SUPPORT_EMAIL_HREF}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Email Support: {VEGAPAL_SUPPORT_EMAIL}
          </a>
        </li>
        <li>
          <a
            href={VEGAPAL_SUPPORT_TELEGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <TelegramIcon className="h-4 w-4 shrink-0" />
            Telegram Support: {VEGAPAL_SUPPORT_TELEGRAM_HANDLE}
          </a>
        </li>
        <li>
          <a href="/#contact" className="text-primary hover:underline">
            Contact Form
          </a>
        </li>
      </ul>
      <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{VEGAPAL_SUPPORT_TRUST}</p>
    </section>
  );
}
