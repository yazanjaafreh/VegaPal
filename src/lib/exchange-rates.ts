/** Fiat rates: Frankfurter v2 (ECB, no API key). Crypto rates: CoinGecko public API (no key). */

export const FIAT_CURRENCIES = ["USD", "AED", "EUR", "SAR", "CNY", "RUB", "INR"] as const;
export const CRYPTO_CURRENCIES = ["USDT", "USDC", "BTC", "ETH"] as const;
export const SUPPORTED_CURRENCIES = [...FIAT_CURRENCIES, ...CRYPTO_CURRENCIES] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export type ExchangeRates = {
  /** USD value of one unit of each currency (e.g. 1 EUR → ~1.08 USD). */
  usdPerUnit: Partial<Record<CurrencyCode, number>>;
  updatedAt: Date;
  fiatAvailable: boolean;
  cryptoAvailable: boolean;
};

const CACHE_TTL_MS = 60_000;
const FRANKFURTER_API = "https://api.frankfurter.dev/v2/rates?base=USD";
const COINGECKO_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,bitcoin,ethereum&vs_currencies=usd";

const FRANKFURTER_FIATS = FIAT_CURRENCIES.filter((c) => c !== "USD");

const COINGECKO_IDS: Record<(typeof CRYPTO_CURRENCIES)[number], string> = {
  USDT: "tether",
  USDC: "usd-coin",
  BTC: "bitcoin",
  ETH: "ethereum",
};

let cache: { data: ExchangeRates; expiresAt: number } | null = null;

export function isCryptoCurrency(code: CurrencyCode): boolean {
  return (CRYPTO_CURRENCIES as readonly string[]).includes(code);
}

export function conversionNeedsCrypto(from: CurrencyCode, to: CurrencyCode): boolean {
  return isCryptoCurrency(from) || isCryptoCurrency(to);
}

async function fetchFiatUsdPerUnit(): Promise<Record<(typeof FIAT_CURRENCIES)[number], number>> {
  const res = await fetch(FRANKFURTER_API);
  if (!res.ok) {
    throw new Error(`Frankfurter API HTTP ${res.status}`);
  }

  const json = (await res.json()) as Array<{ quote: string; rate: number }>;
  const rateByQuote = new Map(json.map((row) => [row.quote, row.rate]));

  const usdPerUnit = { USD: 1 } as Record<(typeof FIAT_CURRENCIES)[number], number>;

  for (const code of FRANKFURTER_FIATS) {
    const unitsPerUsd = rateByQuote.get(code);
    if (!unitsPerUsd || !Number.isFinite(unitsPerUsd)) {
      throw new Error(`Missing fiat rate for ${code}`);
    }
    usdPerUnit[code] = 1 / unitsPerUsd;
  }

  return usdPerUnit;
}

async function fetchCryptoUsdPerUnit(): Promise<Record<(typeof CRYPTO_CURRENCIES)[number], number>> {
  const res = await fetch(COINGECKO_API);
  if (!res.ok) {
    throw new Error(`CoinGecko API HTTP ${res.status}`);
  }

  const json = (await res.json()) as Record<string, { usd?: number }>;
  const usdPerUnit = {} as Record<(typeof CRYPTO_CURRENCIES)[number], number>;

  for (const code of CRYPTO_CURRENCIES) {
    const price = json[COINGECKO_IDS[code]]?.usd;
    if (!price || !Number.isFinite(price)) {
      throw new Error(`Missing crypto rate for ${code}`);
    }
    usdPerUnit[code] = price;
  }

  return usdPerUnit;
}

export async function getExchangeRates(forceRefresh = false): Promise<ExchangeRates> {
  if (!forceRefresh && cache && Date.now() < cache.expiresAt) {
    return cache.data;
  }

  const usdPerUnit: Partial<Record<CurrencyCode, number>> = { USD: 1 };
  let fiatAvailable = false;
  let cryptoAvailable = false;

  try {
    const fiat = await fetchFiatUsdPerUnit();
    Object.assign(usdPerUnit, fiat);
    fiatAvailable = true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[exchange-rates] Frankfurter API failed:", error);
    }
  }

  try {
    const crypto = await fetchCryptoUsdPerUnit();
    Object.assign(usdPerUnit, crypto);
    cryptoAvailable = true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[exchange-rates] CoinGecko API failed:", error);
    }
  }

  const data: ExchangeRates = {
    usdPerUnit,
    updatedAt: new Date(),
    fiatAvailable,
    cryptoAvailable,
  };

  if (fiatAvailable || cryptoAvailable) {
    cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  }

  return data;
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRates,
): number {
  if (!Number.isFinite(amount) || amount < 0) return NaN;

  const fromRate = rates.usdPerUnit[from];
  const toRate = rates.usdPerUnit[to];
  if (!fromRate || !toRate || !Number.isFinite(fromRate) || !Number.isFinite(toRate)) {
    return NaN;
  }

  const usdValue = amount * fromRate;
  return usdValue / toRate;
}

export function formatConvertedAmount(value: number, currency: CurrencyCode): string {
  if (!Number.isFinite(value)) return "—";

  const maxDecimals =
    currency === "BTC" || currency === "ETH" ? 8 : currency === "USDT" || currency === "USDC" ? 4 : 2;

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  });
}

export function formatRatesUpdatedAt(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
