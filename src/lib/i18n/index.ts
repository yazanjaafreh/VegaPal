import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  isSupportedLanguage,
  persistLanguage,
} from "./languages";
import { BOOTSTRAP_NAMESPACES } from "./load-namespace";

import enCommon from "../../../locales/en/common.json";
import enLanding from "../../../locales/en/landing.json";

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
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: [...BOOTSTRAP_NAMESPACES],
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
