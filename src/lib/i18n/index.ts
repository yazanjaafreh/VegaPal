import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  isSupportedLanguage,
  persistLanguage,
  type SupportedLanguage,
} from "./languages";

import enCommon from "../../../locales/en/common.json";
import enLanding from "../../../locales/en/landing.json";
import enAuth from "../../../locales/en/auth.json";
import enDashboard from "../../../locales/en/dashboard.json";
import enInvoices from "../../../locales/en/invoices.json";
import enSettings from "../../../locales/en/settings.json";

import thCommon from "../../../locales/th/common.json";
import thLanding from "../../../locales/th/landing.json";
import thAuth from "../../../locales/th/auth.json";
import thDashboard from "../../../locales/th/dashboard.json";
import thInvoices from "../../../locales/th/invoices.json";
import thSettings from "../../../locales/th/settings.json";

import zhCommon from "../../../locales/zh/common.json";
import zhLanding from "../../../locales/zh/landing.json";
import zhAuth from "../../../locales/zh/auth.json";
import zhDashboard from "../../../locales/zh/dashboard.json";
import zhInvoices from "../../../locales/zh/invoices.json";
import zhSettings from "../../../locales/zh/settings.json";

import ruCommon from "../../../locales/ru/common.json";
import ruLanding from "../../../locales/ru/landing.json";
import ruAuth from "../../../locales/ru/auth.json";
import ruDashboard from "../../../locales/ru/dashboard.json";
import ruInvoices from "../../../locales/ru/invoices.json";
import ruSettings from "../../../locales/ru/settings.json";

export const I18N_NAMESPACES = [
  "common",
  "landing",
  "auth",
  "dashboard",
  "invoices",
  "settings",
] as const;

export type I18nNamespace = (typeof I18N_NAMESPACES)[number];

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    auth: enAuth,
    dashboard: enDashboard,
    invoices: enInvoices,
    settings: enSettings,
  },
  th: {
    common: thCommon,
    landing: thLanding,
    auth: thAuth,
    dashboard: thDashboard,
    invoices: thInvoices,
    settings: thSettings,
  },
  zh: {
    common: zhCommon,
    landing: zhLanding,
    auth: zhAuth,
    dashboard: zhDashboard,
    invoices: zhInvoices,
    settings: zhSettings,
  },
  ru: {
    common: ruCommon,
    landing: ruLanding,
    auth: ruAuth,
    dashboard: ruDashboard,
    invoices: ruInvoices,
    settings: ruSettings,
  },
} as const;

const initialLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: [...I18N_NAMESPACES],
  returnEmptyString: false,
  interpolation: { escapeValue: false },
  // Bundled resources load async; without this, useTranslation suspends and
  // TanStack Start SSR has no Suspense boundary → root error page.
  react: { useSuspense: false },
});

if (typeof window !== "undefined") {
  const stored = getStoredLanguage();
  if (stored && stored !== i18n.language) {
    void i18n.changeLanguage(stored);
  }
}

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  if (isSupportedLanguage(lng)) {
    persistLanguage(lng);
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;
