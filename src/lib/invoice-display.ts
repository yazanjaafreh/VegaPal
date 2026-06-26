import type { Invoice } from "@/lib/vegapal-store";
import type { DisplayOptions } from "@/lib/invoice-constants";

export function formatInvoiceAmount(n: number, currency: string) {
  const value = Number(n);
  const safe = Number.isFinite(value) ? value : 0;
  const code = currency?.trim() || "USDT";
  const maxDecimals = code === "BTC" || code === "ETH" ? 8 : 2;
  return safe.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  });
}

export function formatInvoiceAmountWithCurrency(n: number, currency: string) {
  const code = currency?.trim() || "USDT";
  return `${formatInvoiceAmount(n, code)} ${code}`;
}

export function isCryptoPaymentVisible(inv: Invoice) {
  const { method, crypto } = inv.paymentMethods;
  if (method === "crypto") return true;
  if (method === "multiple") return crypto.enabled;
  return false;
}

export function isBankPaymentVisible(inv: Invoice) {
  const { method, bank } = inv.paymentMethods;
  if (method === "bank_transfer") return true;
  if (method === "multiple") return bank.enabled;
  return false;
}

export function isCashPaymentVisible(inv: Invoice) {
  const { method, cash } = inv.paymentMethods;
  if (method === "cash") return true;
  if (method === "multiple") return cash.enabled;
  return false;
}

export function showReferenceField(
  display: DisplayOptions,
  toggle: "showPoNumber" | "showReferenceNumber" | "showProjectCode",
  value?: string | null,
) {
  return display[toggle] && Boolean(value?.trim());
}
