import type { Json } from "@/integrations/supabase/types";

export const FIAT_CURRENCY_OPTIONS = [
  { code: "USD", name: "US Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "EUR", name: "Euro" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "INR", name: "Indian Rupee" },
] as const;

export const CRYPTO_CURRENCY_OPTIONS = [
  { code: "USDT", name: "Tether" },
  { code: "USDC", name: "USD Coin" },
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
] as const;

export const INVOICE_CURRENCIES = [
  ...FIAT_CURRENCY_OPTIONS.map((c) => c.code),
  ...CRYPTO_CURRENCY_OPTIONS.map((c) => c.code),
] as const;

export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];

export function invoiceCurrencyLabel(code: string): string {
  const match = [...FIAT_CURRENCY_OPTIONS, ...CRYPTO_CURRENCY_OPTIONS].find(
    (c) => c.code === code,
  );
  return match ? `${match.code} — ${match.name}` : code;
}

export const DEFAULT_INVOICE_CURRENCY: InvoiceCurrency = "USDT";

export const CRYPTO_PAYMENT_CURRENCIES = ["USDT", "USDC", "BTC", "ETH"] as const;

export const PAYMENT_NETWORKS = [
  "TRON TRC20",
  "Ethereum ERC20",
  "BNB Smart Chain BEP20",
  "Bitcoin",
  "Solana",
] as const;

export type PaymentMethodType = "crypto" | "bank_transfer" | "cash" | "multiple";

export interface CryptoPaymentConfig {
  enabled: boolean;
  currency: string;
  network: string;
  walletAddress: string;
}

export interface BankPaymentConfig {
  enabled: boolean;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  iban?: string | null;
  swift?: string | null;
  currency?: string | null;
  instructions?: string | null;
}

export interface CashPaymentConfig {
  enabled: boolean;
  instructions?: string | null;
  location?: string | null;
}

export interface PaymentMethodsConfig {
  method: PaymentMethodType;
  crypto: CryptoPaymentConfig;
  bank: BankPaymentConfig;
  cash: CashPaymentConfig;
}

export interface DisplayOptions {
  showVegapalLogo: boolean;
  showSellerInfo: boolean;
  showClientInfo: boolean;
  showDueDate: boolean;
  showStatus: boolean;
  showDiscount: boolean;
  showTax: boolean;
  showNotes: boolean;
  showTerms: boolean;
  showPaymentInstructions: boolean;
  showPoNumber: boolean;
  showReferenceNumber: boolean;
  showProjectCode: boolean;
}

export const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  showVegapalLogo: true,
  showSellerInfo: true,
  showClientInfo: true,
  showDueDate: true,
  showStatus: true,
  showDiscount: false,
  showTax: false,
  showNotes: false,
  showTerms: false,
  showPaymentInstructions: true,
  showPoNumber: false,
  showReferenceNumber: false,
  showProjectCode: false,
};

const LEGACY_NETWORK_MAP: Record<string, string> = {
  TRC20: "TRON TRC20",
  ERC20: "Ethereum ERC20",
  BEP20: "BNB Smart Chain BEP20",
};

export function mapLegacyNetwork(network: string | null | undefined): string {
  if (!network) return "TRON TRC20";
  return LEGACY_NETWORK_MAP[network] ?? network;
}

export function legacyNetworkFromCanonical(network: string): string {
  const entry = Object.entries(LEGACY_NETWORK_MAP).find(([, v]) => v === network);
  return entry?.[0] ?? network;
}

export function buildDefaultPaymentMethods(
  walletAddress: string,
  legacyNetwork?: string,
): PaymentMethodsConfig {
  return {
    method: "crypto",
    crypto: {
      enabled: true,
      currency: "USDT",
      network: mapLegacyNetwork(legacyNetwork),
      walletAddress,
    },
    bank: { enabled: false },
    cash: { enabled: false },
  };
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function normalizeDisplayOptions(raw: Json | null | undefined): DisplayOptions {
  const obj = asObject(raw);
  if (!obj) return { ...DEFAULT_DISPLAY_OPTIONS };

  return {
    showVegapalLogo: asBool(obj.showVegapalLogo, DEFAULT_DISPLAY_OPTIONS.showVegapalLogo),
    showSellerInfo: asBool(obj.showSellerInfo, DEFAULT_DISPLAY_OPTIONS.showSellerInfo),
    showClientInfo: asBool(obj.showClientInfo, DEFAULT_DISPLAY_OPTIONS.showClientInfo),
    showDueDate: asBool(obj.showDueDate, DEFAULT_DISPLAY_OPTIONS.showDueDate),
    showStatus: asBool(obj.showStatus, DEFAULT_DISPLAY_OPTIONS.showStatus),
    showDiscount: asBool(obj.showDiscount, DEFAULT_DISPLAY_OPTIONS.showDiscount),
    showTax: asBool(obj.showTax, DEFAULT_DISPLAY_OPTIONS.showTax),
    showNotes: asBool(obj.showNotes, DEFAULT_DISPLAY_OPTIONS.showNotes),
    showTerms: asBool(obj.showTerms, DEFAULT_DISPLAY_OPTIONS.showTerms),
    showPaymentInstructions: asBool(
      obj.showPaymentInstructions,
      DEFAULT_DISPLAY_OPTIONS.showPaymentInstructions,
    ),
    showPoNumber: asBool(obj.showPoNumber, DEFAULT_DISPLAY_OPTIONS.showPoNumber),
    showReferenceNumber: asBool(
      obj.showReferenceNumber,
      DEFAULT_DISPLAY_OPTIONS.showReferenceNumber,
    ),
    showProjectCode: asBool(obj.showProjectCode, DEFAULT_DISPLAY_OPTIONS.showProjectCode),
  };
}

function normalizeCryptoPayment(
  raw: unknown,
  walletAddress: string,
  legacyNetwork?: string,
): CryptoPaymentConfig {
  const obj = asObject(raw);
  const defaults = buildDefaultPaymentMethods(walletAddress, legacyNetwork).crypto;
  if (!obj) return defaults;

  return {
    enabled: asBool(obj.enabled, defaults.enabled),
    currency: asString(obj.currency, defaults.currency),
    network: mapLegacyNetwork(asString(obj.network, defaults.network)),
    walletAddress: asString(obj.walletAddress, walletAddress || defaults.walletAddress),
  };
}

function normalizeBankPayment(raw: unknown): BankPaymentConfig {
  const obj = asObject(raw);
  if (!obj) return { enabled: false };

  return {
    enabled: asBool(obj.enabled, false),
    bankName: asNullableString(obj.bankName),
    accountName: asNullableString(obj.accountName),
    accountNumber: asNullableString(obj.accountNumber),
    iban: asNullableString(obj.iban),
    swift: asNullableString(obj.swift),
    currency: asNullableString(obj.currency),
    instructions: asNullableString(obj.instructions),
  };
}

function normalizeCashPayment(raw: unknown): CashPaymentConfig {
  const obj = asObject(raw);
  if (!obj) return { enabled: false };

  return {
    enabled: asBool(obj.enabled, false),
    instructions: asNullableString(obj.instructions),
    location: asNullableString(obj.location),
  };
}

function isEmptyPaymentMethods(raw: Json | null | undefined): boolean {
  if (raw == null) return true;
  if (typeof raw !== "object" || Array.isArray(raw)) return true;
  return Object.keys(raw).length === 0;
}

export function normalizePaymentMethods(
  raw: Json | null | undefined,
  walletAddress: string,
  legacyNetwork?: string,
): PaymentMethodsConfig {
  if (isEmptyPaymentMethods(raw)) {
    return buildDefaultPaymentMethods(walletAddress, legacyNetwork);
  }

  const obj = asObject(raw)!;
  const method = asString(obj.method, "crypto") as PaymentMethodType;
  const crypto = normalizeCryptoPayment(obj.crypto, walletAddress, legacyNetwork);

  return {
    method:
      method === "bank_transfer" || method === "cash" || method === "multiple"
        ? method
        : "crypto",
    crypto,
    bank: normalizeBankPayment(obj.bank),
    cash: normalizeCashPayment(obj.cash),
  };
}

export function paymentMethodsToJson(config: PaymentMethodsConfig): Json {
  return config as unknown as Json;
}

export function displayOptionsToJson(options: DisplayOptions): Json {
  return options as unknown as Json;
}
