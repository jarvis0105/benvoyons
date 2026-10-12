import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation } from 'wouter';

import { EN } from './en';

/* ────────────────────────────────────────────────────────────────
   Bilingue français / anglais.

   Le français est la langue source : les clés du dictionnaire sont
   les phrases françaises elles-mêmes. Deux avantages — le code
   reste lisible (`t("Réserver une table")`), et une traduction
   manquante affiche le français plutôt qu'une clé technique.

   L'anglais vit sous le préfixe /en (ex. /en/menus), ce qui donne
   une URL distincte par langue : indispensable pour que Google
   indexe les deux versions.
   ──────────────────────────────────────────────────────────────── */

export type Lang = 'fr' | 'en';

type LangContextValue = {
  lang: Lang;
  /** Traduit une phrase française. */
  t: (fr: string) => string;
  /** Préfixe un chemin interne avec la langue courante. */
  path: (p: string) => string;
  /** Même page dans l'autre langue. */
  otherLangHref: string;
  other: Lang;
};

const LangContext = createContext<LangContextValue | null>(null);

export function stripLangPrefix(pathname: string): string {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname;
}

export function detectLang(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const lang = detectLang(location);
  const bare = stripLangPrefix(location);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (fr: string) => (lang === 'en' ? (EN[fr] ?? fr) : fr),
    [lang],
  );

  const path = useCallback(
    (p: string) => {
      if (lang === 'fr') return p;
      return p === '/' ? '/en' : `/en${p}`;
    },
    [lang],
  );

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      t,
      path,
      other: lang === 'fr' ? 'en' : 'fr',
      otherLangHref:
        lang === 'fr' ? (bare === '/' ? '/en' : `/en${bare}`) : bare,
    }),
    [lang, t, path, bare],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang doit être utilisé à l’intérieur de <LangProvider>');
  }
  return ctx;
}
