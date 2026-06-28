import { Mail } from "lucide-react";
import { TelegramIcon } from "@/components/icons/TelegramIcon";

export function LearnSupport() {
  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8" aria-labelledby="learn-support-heading">
      <h2 id="learn-support-heading" className="text-2xl font-bold tracking-tight text-foreground">
        Need Help?
      </h2>
      <p className="mt-2 text-muted-foreground">
        Our support team is available 24 hours a day, 7 days a week.
      </p>
      <p className="mt-4 text-sm font-medium text-foreground">Contact us through:</p>
      <ul className="mt-3 space-y-3 text-sm">
        <li>
          <a
            href="mailto:support@vegapal.com"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Email Support
          </a>
        </li>
        <li>
          <a
            href="https://t.me/vegapal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <TelegramIcon className="h-4 w-4 shrink-0" />
            Telegram Support
          </a>
        </li>
        <li>
          <a href="/#contact" className="text-primary hover:underline">
            Contact Form
          </a>
        </li>
      </ul>
    </section>
  );
}
