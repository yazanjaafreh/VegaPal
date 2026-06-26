import i18n, { type I18nNamespace } from "./index";
import { isSupportedLanguage, type SupportedLanguage } from "./languages";

export const BOOTSTRAP_NAMESPACES: I18nNamespace[] = ["common", "landing"];

const loadedNamespaces = new Set<I18nNamespace>(BOOTSTRAP_NAMESPACES);

export function markNamespacesLoaded(namespaces: readonly I18nNamespace[]) {
  for (const ns of namespaces) {
    loadedNamespaces.add(ns);
  }
}

export async function ensureNamespacesLoaded(namespaces: I18nNamespace[]) {
  const pending = namespaces.filter((ns) => !loadedNamespaces.has(ns));
  if (pending.length === 0) return;

  const lng = i18n.language;
  if (lng !== "en" && isSupportedLanguage(lng)) {
    const { ensureLanguageLoaded } = await import("./load-locale");
    await ensureLanguageLoaded(lng);
    return;
  }

  await Promise.all(
    pending.map(async (ns) => {
      const mod = await import(`../../../locales/en/${ns}.json`);
      i18n.addResourceBundle("en", ns, mod.default, true, true);
      loadedNamespaces.add(ns);
    }),
  );
}
