import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PageHero, Title, Kicker, UnderlineLink } from "@/components/editorial";
import { Star } from "lucide-react";
import { useLang } from "@/i18n";
import { REVIEWS } from "@/lib/content";


/* ── Distinctions ────────────────────────────────────────────────── */
/* Chaque distinction pointe vers sa fiche officielle : les deux
   badges Michelin (étoile rouge + étoile verte) renvoient vers la
   même page du Guide Michelin, qui affiche les deux ; le badge
   Gault & Millau renvoie vers la fiche du restaurant sur
   gaultmillau.com. Le score chiffré (15,5/20) a été retiré : le
   visuel des trois toques suffit à porter la distinction, sans
   dupliquer une note qui vit déjà sur la fiche Gault & Millau
   elle-même. */
const MICHELIN_URL = "https://guide.michelin.com/fr/fr/pays-de-la-loire/angers/restaurant/lait-thym-sel";
const GAULT_MILLAU_URL = "https://fr.gaultmillau.com/fr/restaurants/lait-thym-sel";

const AWARDS = [
  {
    badge: "/badges/badge-michelin-etoile.png",
    label: "Étoile Michelin",
    detail: "Étoilé depuis 2019",
    bg: "bg-foreground",
    text: "text-white",
    accent: "text-brand-strong",
    href: MICHELIN_URL,
  },
  {
    badge: "/badges/badge-michelin-verte.png",
    label: "Étoile Verte",
    detail: "Gastronomie durable · Depuis 2021",
    bg: "bg-foreground",
    text: "text-white",
    accent: "text-brand-strong",
    href: MICHELIN_URL,
  },
  {
    badge: "/badges/badge-gault-millau-toques.png",
    label: "Gault & Millau",
    detail: "3 toques",
    bg: "bg-foreground",
    text: "text-white",
    accent: "text-brand-strong",
    href: GAULT_MILLAU_URL,
  },
];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Distinctions & Avis — LAIT THYM SEL")}
        description={t(
          "Découvrez les distinctions et avis authentiques du restaurant gastronomique Lait Thym Sel à Angers : Étoile Michelin, Étoile Verte, Gault & Millau.",
        )}
      />

      <PageHero
        kicker={t("Fanny & Gaëtan Morvan · Angers")}
        before={t("Ce que l’on")}
        accent={t("dit")}
        after={t("de la table")}
        sub={t("Étoilée depuis 2019")}
      />

      {/* ── Awards ─────────────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="py-14 md:py-20 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {AWARDS.map((a, i) => (
              <a
                key={i}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                                className={`reveal-fade ${a.bg} ${a.text} p-10 text-center flex flex-col items-center justify-center gap-3 transition-opacity duration-300 hover:opacity-90`}
                                style={{ ['--reveal-delay' as string]: `${i * 140}ms` }}
              >
                <img
                  src={a.badge}
                  alt={t(a.label)}
                  className="h-16 w-auto object-contain md:h-20"
                  loading="lazy"
                />
                <div>
                  <p className={`font-serif text-lg font-medium ${a.text}`}>{t(a.label)}</p>
                  <p className={`text-xs uppercase tracking-[0.25em] mt-1 ${a.accent}`}>{t(a.detail)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google rating summary ──────────────────────────────────── */}
      <section className="py-10 bg-card border-b border-border/50 reveal-section">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-4">
            <StarRow count={5} />
            <span className="font-serif text-2xl text-foreground">4,8 / 5</span>
            <span className="text-muted-foreground text-sm">{t("287 avis Google")}</span>
          </div>
        </div>
      </section>

      {/* ── Real Google Reviews ───────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-6xl mx-auto">
            <Kicker number="02">{t("Avis publics Google")}</Kicker>
            <Title before={t("Ce que")} accent={t("vous")} after={t("en pensez")} sub={t("4,8 / 5 sur 287 avis")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="reveal-fade premium-card bg-background border border-border/40 p-7 flex flex-col gap-4"
                style={{ ['--reveal-delay' as string]: `${(i % 3) * 130}ms` }}
              >
                {/* Google icon + stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Google G icon (SVG inline) */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <StarRow count={r.stars} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t(r.category)}</span>
                </div>

                {/* Review text */}
                <blockquote className="font-serif italic text-muted-foreground leading-relaxed flex-1 text-[15px]">
                  {t('« ')}{t(r.text)}{t(' »')}
                </blockquote>

                {/* Verified badge */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                  <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] text-muted-foreground">{t("Avis Google vérifié")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Link to Google */}
          <div className="text-center mt-12">
            <a
              href="https://g.co/kgs/laitthymsel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              {t("Voir tous les avis sur Google Maps")}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Réservation ────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="py-20 md:py-28 bg-foreground text-background text-center reveal-section">
        <div className="container mx-auto px-4 max-w-xl space-y-6">
          <span
            className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-background/75"
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            {t("17 Rue Boisnet, Angers")}
          </span>
          <h3 className="lts-title lts-title--lg lts-title--inherit reveal-fade" style={{ ['--reveal-delay' as string]: '110ms' }}>
            {t("Vivez")} <em>{t("l’expérience")}</em>
          </h3>
          <p
            className="reveal-fade font-serif italic text-background/65 text-lg"
            style={{ ['--reveal-delay' as string]: '300ms' }}
          >
            {t("Rejoignez les convives qui font confiance à Lait Thym Sel depuis 2017.")}
          </p>
          <UnderlineLink href={path("/reservation")} onDark>{t("Réserver une table")}</UnderlineLink>
        </div>
      </section>
    </Layout>
  );
}
