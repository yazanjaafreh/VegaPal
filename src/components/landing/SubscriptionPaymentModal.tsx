import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";
import type { TFunction } from "i18next";
import { PaymentQr } from "@/components/landing/PaymentQr";

const SUBSCRIPTION_WALLETS = [
  {
    network: "TRON TRC20",
    address: "TUckRdnGxRY7VehPLfu5RLz6QspQ8T4Sj5",
  },
  {
    network: "BNB Smart Chain BEP20",
    address: "0xFB597F1b4Cf04F4a60bA36730C08e9180Fd932c2",
  },
] as const;

export type SubscriptionPlan = { planKey: "pro" | "business"; price: number };

function getSubscriptionNetworkLabel(network: string, t: TFunction<"landing">): string {
  if (network === "TRON TRC20") return t("subscriptionModal.networkTron");
  if (network === "BNB Smart Chain BEP20") return t("subscriptionModal.networkBep20");
  return network;
}

function CopyWalletButton({ address }: { address: string }) {
  const { t: tc } = useTranslation("common");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} className="gap-1.5">
      <Copy className="h-3.5 w-3.5" />
      {copied ? tc("buttons.copied") : tc("buttons.copyWallet")}
    </Button>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.71a.2.2 0 0 0-.05-.18c-.05-.04-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.22-1.55-.4-.63-.21-1.13-.31-1.08-.66.02-.18.27-.36.92-.55 3.6-1.57 6.01-2.61 7.21-3.11 3.43-1.43 4.14-1.68 4.61-1.69.1 0 .33.02.48.14.12.1.16.24.17.34.01.1.03.32.01.49z" />
    </svg>
  );
}

export function SubscriptionPaymentModal({
  plan,
  open,
  onOpenChange,
}: {
  plan: SubscriptionPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation("landing");
  const { t: tc } = useTranslation("common");

  if (!plan) return null;

  const planName = t(`pricing.plans.${plan.planKey}.name`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("subscriptionModal.title", { plan: planName })}</DialogTitle>
          <DialogDescription>{t("subscriptionModal.description")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{tc("labels.plan")}</p>
              <p className="font-semibold">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("subscriptionModal.amountLabel")}
              </p>
              <p className="text-2xl font-bold tabular-nums">
                ${plan.price}{" "}
                <span className="text-sm font-medium text-muted-foreground">{tc("usdtPerMonth")}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium">{t("subscriptionModal.paymentMethods")}</p>
          {SUBSCRIPTION_WALLETS.map((wallet) => (
            <div key={wallet.address} className="rounded-xl border border-border p-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{tc("labels.network")}</p>
                <p className="text-sm font-semibold">{getSubscriptionNetworkLabel(wallet.network, t)}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <PaymentQr value={wallet.address} />
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{tc("labels.walletAddress")}</p>
                    <p className="text-sm font-mono break-all leading-snug">{wallet.address}</p>
                  </div>
                  <CopyWalletButton address={wallet.address} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground leading-relaxed">
          {t("subscriptionModal.instructions")}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="flex-1">
            <a href="https://t.me/vegapal" target="_blank" rel="noopener noreferrer">
              <TelegramIcon className="h-4 w-4" />
              {t("subscriptionModal.telegram")}
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href="mailto:support@vegapal.com">
              <Mail className="h-4 w-4" />
              support@vegapal.com
            </a>
          </Button>
        </div>

        <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" aria-hidden />
          <p className="text-muted-foreground">{t("subscriptionModal.networkWarning")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
