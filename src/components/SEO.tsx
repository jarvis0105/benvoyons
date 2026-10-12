import { useEffect } from 'react';
import { useLocation } from 'wouter';

import { SITE_URL } from '@/lib/restaurant';
import { detectLang, stripLangPrefix } from '@/i18n';

/* ────────────────────────────────────────────────────────────────
   Métadonnées par page.

   Attention : ces balises sont posées côté navigateur. Elles
   servent aux moteurs de recherche, qui exécutent le JavaScript,
   mais PAS aux aperçus de partage (Facebook, WhatsApp, LinkedIn,
   Slack) : ces robots-là lisent le HTML brut sans jamais exécuter
   le JavaScript.

   C'est pourquoi index.html contient déjà, en dur, un jeu complet
   de balises Open Graph et une image de partage. Un lien partagé
   affiche donc toujours un aperçu correct, quelle que soit la page.

   Pour obtenir un aperçu spécifique à chaque page, il faut un
   prérendu au moment du build (vite-plugin-ssg, ou l'option
   « prerendering » de Netlify). Voir le README.
   ──────────────────────────────────────────────────────────────── */

interface SEOProps {
  title: string;
  description: string;
  /** Chemin sans préfixe de langue, ex. "/menus" */
  canonicalPath?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void,
) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

function meta(attr: 'name' | 'property', key: string, content: string) {
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute(attr, key);
      return el;
    },
    (el) => el.setAttribute('content', content),
  );
}

function link(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  upsert(
    selector,
    () => {
      const el = document.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      return el;
    },
    (el) => el.setAttribute('href', href),
  );
}

export function SEO({
  title,
  description,
  canonicalPath,
  image = `${SITE_URL}/og-image.jpg`,
  jsonLd,
}: SEOProps) {
  const [location] = useLocation();
  const lang = detectLang(location);
  const bare = canonicalPath ?? stripLangPrefix(location);
  const frUrl = `${SITE_URL}${bare}`;
  const enUrl = `${SITE_URL}${bare === '/' ? '/en' : `/en${bare}`}`;
  const canonical = lang === 'en' ? enUrl : frUrl;

  useEffect(() => {
    document.title = title;
    meta('name', 'description', description);

    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('property', 'og:url', canonical);
    meta('property', 'og:image', image);
    meta('property', 'og:locale', lang === 'en' ? 'en_GB' : 'fr_FR');
    meta('name', 'twitter:title', title);
    meta('name', 'twitter:description', description);
    meta('name', 'twitter:image', image);

    link('canonical', canonical);
    link('alternate', frUrl, 'fr');
    link('alternate', enUrl, 'en');
    link('alternate', frUrl, 'x-default');
  }, [title, description, canonical, image, lang, frUrl, enUrl]);

  useEffect(() => {
    const id = 'page-json-ld';
    document.getElementById(id)?.remove();
    if (!jsonLd) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [jsonLd]);

  return null;
}
