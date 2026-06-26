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
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: [...I18N_NAMESPACES],
  returnEmptyString: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (typeof window !== "undefined") {
  const stored = getStoredLanguage();
  if (stored && stored !== "en" && stored !== i18n.language) {
    void import("./load-locale").then(({ ensureLanguageLoaded }) =>
      ensureLanguageLoaded(stored).then(() => i18n.changeLanguage(stored)),
    );
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
