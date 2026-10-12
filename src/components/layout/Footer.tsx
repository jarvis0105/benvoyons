import { Link } from "wouter";
import { useLang } from "@/i18n";
import { PHOTO_CREDIT, GIFT_SHOP_URL } from "@/lib/maison";
import { Ornament } from "@/components/Ornament";
import { DINNER_DAYS_LABEL, LUNCH_DAYS_LABEL, formatService, LUNCH, DINNER, RESTAURANT } from "@/lib/restaurant";

/* ────────────────────────────────────────────────────────────────
   Pied de page.

   Un grand titre en capitales, son sous-titre en italique, puis
   quatre colonnes qui répètent la même construction : un titre
   court en capitales, une ligne en italique gras, trois lignes de
   texte et un lien souligné d'un filet. L'emblème de la maison est
   posé en filigrane sur la droite. */

function InstagramMark(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookMark(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function Footer() {
  const { t, path, lang, otherLangHref, other } = useLang();

  const columns = [
    {
      title: t('Une table'),
      lead: t('Au cœur'),
      strong: t('d’Angers'),
      text: `${RESTAURANT.street}, ${RESTAURANT.postalCode} ${RESTAURANT.city}. ${t(LUNCH_DAYS_LABEL)} · ${t(formatService(LUNCH))}. ${t(DINNER_DAYS_LABEL)} · ${t(formatService(DINNER))}.`,
      href: path('/reservation'),
      cta: t('Réserver votre table'),
      testId: 'link-footer-reserve',
    },
    {
      title: t('Une cuisine'),
      lead: t('De saison,'),
      strong: t('de producteurs'),
      text: t('Un menu unique qui suit les arrivages, de trois à neuf étincelles, servi pour l’ensemble de la table.'),
      href: path('/menus'),
      cta: t('Explorer la carte'),
      testId: 'link-footer-explore-menus',
    },
    {
      title: t('Une maison'),
      lead: t('Fanny &'),
      strong: t('Gaëtan Morvan'),
      text: t('Deux cuisiniers, une maison ouverte en 2017, étoilée au Guide Michelin depuis 2019.'),
      href: path('/a-propos'),
      cta: t('Notre histoire'),
      testId: 'link-footer-explore-a-propos',
    },
    {
      title: t('Un cadeau'),
      lead: t('Offrir'),
      strong: t('une parenthèse'),
      text: t('Chèques et coffrets cadeaux sont disponibles sur notre boutique en ligne.'),
      href: GIFT_SHOP_URL,
      cta: t('Notre boutique'),
      external: true,
      testId: 'link-footer-explore-boutique',
    },
  ];

  return (
    <footer data-nav-theme="dark" className="lts-footer relative overflow-hidden bg-foreground text-background">
      <span className="lts-footer__emblem" aria-hidden="true">
        <img src="/logos/logo-emblem-mark.png" alt="" loading="lazy" />
      </span>

      <div className="lts-container relative">
        <div className="flex flex-col gap-10 pt-16 md:flex-row md:items-start md:justify-between md:pt-24">
          <div className="reveal-fade">
            <Ornament kind="thym" tone="light" className="mb-8" />
            <h2 className="lts-title lts-title--lg lts-title--inherit">{t('Dîner chez')} <em>{t('Lait Thym Sel')}</em></h2>
            <span className="lts-script lts-script--footer">{t('Au cœur d’Angers')}</span>
            <p className="mt-10 font-serif text-sm">
              {t('Contact')} – <strong className="italic font-semibold">{RESTAURANT.email}</strong>
              <span className="mx-3 opacity-40">/</span>
              <a href={RESTAURANT.phoneHref} className="italic font-semibold" data-testid="link-footer-phone">{RESTAURANT.phone}</a>
            </p>
          </div>
          <div className="flex items-center gap-5 md:pt-3">
            <img src="/badges/badge-michelin-etoile.png" alt={t('Guide Michelin')} className="h-12 w-12 object-contain opacity-90" loading="lazy" />
            <img src="/badges/badge-michelin-verte.png" alt={t('Étoile verte')} className="h-12 w-12 object-contain opacity-90" loading="lazy" />
            <img src="/badges/badge-gault-millau-toques.png" alt={t('Gault & Millau')} className="h-12 w-12 object-contain opacity-90" loading="lazy" />
          </div>
        </div>

        <div className="mt-24 grid gap-12 md:mt-40 md:grid-cols-4 md:gap-8">
          {columns.map((c) => (
            <div key={c.title} className="reveal-fade lts-footer__col">
              <h3 className="font-serif text-xl uppercase leading-tight md:text-2xl">{c.title}</h3>
              <p className="mt-1 font-serif text-sm">
                {c.lead} <strong className="italic font-semibold">{c.strong}</strong>
              </p>
              <p className="mt-4 max-w-[300px] text-[13px] leading-[1.85] text-background/85">{c.text}</p>
              <div className="mt-5">
                {c.external ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="lts-underline lts-underline--light" data-testid={c.testId}>{c.cta}</a>
                ) : (
                  <Link href={c.href} className="lts-underline lts-underline--light" data-testid={c.testId}>{c.cta}</Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-background/15 py-7 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-sm uppercase tracking-wide text-background/90">
            © 2026 LAIT THYM SEL. {t("Tous droits réservés")}.
            <span className="mt-1 block font-sans text-[11px] normal-case tracking-[0.04em] text-background/60">
              {t("Photographies de la maison")} : {PHOTO_CREDIT}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-background/70">
            <Link href={path("/mentions-legales")} className="footer-meta-link" data-testid="link-footer-legal">{t("Mentions légales")}</Link>
            <Link href={path("/rgpd")} className="footer-meta-link" data-testid="link-footer-privacy">{t("RGPD")}</Link>
            <Link href={path("/cgu")} className="footer-meta-link" data-testid="link-footer-terms">{t("CGU")}</Link>
            <span className="flex items-center gap-2">
              <span className={lang === 'fr' ? 'text-background' : 'text-background/40'}>FR</span>
              <span className="text-background/30">/</span>
              {lang === 'fr' ? (
                <Link href={otherLangHref} hrefLang={other} className="footer-link" data-testid="link-footer-lang-en">EN</Link>
              ) : (
                <span className="text-background">EN</span>
              )}
            </span>
            <span className="flex items-center gap-4">
              <a href={RESTAURANT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="link-social-instagram" className="transition-opacity hover:opacity-60"><InstagramMark className="h-4 w-4" /></a>
              <a href={RESTAURANT.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-testid="link-social-facebook" className="transition-opacity hover:opacity-60"><FacebookMark className="h-4 w-4" /></a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
