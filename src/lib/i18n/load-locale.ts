import i18n from "./index";
import { I18N_NAMESPACES } from "./index";
import type { SupportedLanguage } from "./languages";

const loaded = new Set<SupportedLanguage>(["en"]);

export function isLanguageBundleLoaded(lng: SupportedLanguage) {
  return loaded.has(lng);
}

export async function ensureLanguageLoaded(lng: SupportedLanguage) {
  if (lng === "en" || loaded.has(lng)) return;

  const bundles = await Promise.all(
    I18N_NAMESPACES.map(async (ns) => {
      const mod = await import(`../../../locales/${lng}/${ns}.json`);
      return [ns, mod.default] as const;
    }),
  );

  for (const [ns, data] of bundles) {
    i18n.addResourceBundle(lng, ns, data, true, true);
  }

  loaded.add(lng);
}
