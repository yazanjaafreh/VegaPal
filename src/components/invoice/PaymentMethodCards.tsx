import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { qrCodeToDataUrl } from "@/lib/qrcode-lazy";
import { Button } from "@/components/ui/button";
import { Building2, Banknote, Check, Copy, Wallet } from "lucide-react";
import type { Invoice } from "@/lib/vegapal-store";
import {
  formatInvoiceAmountWithCurrency,
  isBankPaymentVisible,
  isCashPaymentVisible,
  isCryptoPaymentVisible,
} from "@/lib/invoice-display";

export function PaymentMethodCards({ inv }: { inv: Invoice }) {
  const { t } = useTranslation("invoices");
  const { t: tc } = useTranslation("common");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  const crypto = inv.paymentMethods.crypto;
  const bank = inv.paymentMethods.bank;
  const cash = inv.paymentMethods.cash;
  const showCrypto = isCryptoPaymentVisible(inv);
  const showBank = isBankPaymentVisible(inv);
  const showCash = isCashPaymentVisible(inv);

  useEffect(() => {
    if (!showCrypto || !crypto.walletAddress) {
      setQr("");
      return;
    }
    qrCodeToDataUrl(crypto.walletAddress, {
      margin: 1,
      width: 280,
      color: { dark: "#0B1220", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [showCrypto, crypto.walletAddress]);

  const copyWallet = async () => {
    if (!crypto.walletAddress) return;
    await navigator.clipboard.writeText(crypto.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!showCrypto && !showBank && !showCash) return null;

  return (
    <div className="space-y-4">
      {showCrypto && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div
            className="px-5 py-4 text-white"
            style={{ background: inv.brandColor || "#0B1220" }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/80">
              <Wallet className="h-4 w-4" />
              {t("paymentCards.cryptoPayment")}
            </div>
            <p className="mt-2 text-lg font-semibold">
              {crypto.currency} · {crypto.network}
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between text-sm gap-4">
              <span className="text-muted-foreground">{tc("labels.amountDue")}</span>
              <span className="font-semibold tabular-nums">
                {formatInvoiceAmountWithCurrency(inv.total, inv.invoiceCurrency)}
              </span>
            </div>
            {qr && (
              <div className="flex justify-center">
                <div className="rounded-xl border border-border bg-white p-3">
                  <img src={qr} alt={tc("qr.walletQrAlt")} className="h-40 w-40" />
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {tc("labels.walletAddress")}
              </p>
              <div className="rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs break-all">
                {crypto.walletAddress || "—"}
              </div>
              {crypto.walletAddress && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={copyWallet}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> {tc("buttons.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> {tc("buttons.copyWalletAddress")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showBank && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-primary" />
            {t("create.paymentMethods.bankTransferTitle")}
          </div>
          <BankRow label={tc("labels.bankName")} value={bank.bankName} />
          <BankRow label={tc("labels.accountName")} value={bank.accountName} />
          <BankRow label={tc("labels.accountNumber")} value={bank.accountNumber} mono />
          <BankRow label={tc("labels.iban")} value={bank.iban} mono />
          <BankRow label={tc("labels.swift")} value={bank.swift} mono />
          <BankRow label={tc("labels.currency")} value={bank.currency} />
          {bank.instructions && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {tc("labels.instructions")}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {bank.instructions}
              </p>
            </div>
          )}
        </div>
      )}

      {showCash && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Banknote className="h-4 w-4 text-primary" />
            {t("create.paymentMethods.cashPayment")}
          </div>
          {cash.instructions && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {tc("labels.instructions")}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {cash.instructions}
              </p>
            </div>
          )}
          {cash.location && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {tc("labels.paymentLocation")}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {cash.location}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BankRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value?.trim()) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right font-medium ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
