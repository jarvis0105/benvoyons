import { useEffect, useRef, useState } from 'react';
import { STOCK } from '@/lib/stock';
import { onScrollFrame } from '@/lib/smoothScroll';
import { Link } from 'wouter';
import { Phone } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { openBooking } from '@/lib/booking';
import { RESTAURANT } from '@/lib/restaurant';
import { MENUS_APERCU } from '@/lib/content';
import { Kicker, Title, UnderlineLink, Etincelles } from '@/components/editorial';
import { Ornament } from '@/components/Ornament';
import { MAISON, PRODUCTEURS, GIFT_SHOP_URL, type MaisonPhoto } from '@/lib/maison';

/* ────────────────────────────────────────────────────────────────
   Page d'accueil : une soirée en six temps.

   Arriver → Reconnaître → Choisir → Rencontrer → Rester → Réserver.
   Chaque section porte son numéro en filigrane et son « temps » en
   étiquette : la numérotation suit l'ordre du repas.

   Une seule voix pour les titres : Bodoni Moda en capitales, graisse
   normale, un mot en italique gras. Un sous-titre italique décalé,
   comme une annotation. Les liens sont soulignés d'un filet.

   Les photos sont celles déjà présentes sur le site. Seules les
   tailles demandées aux serveurs d'images ont été relevées. */

/* ── Invitation finale : du jour à la nuit ───────────────────────
   Section haute ; le bloc reste à l'écran pendant qu'on la traverse
   grâce à `position: sticky` (géré par le navigateur, donc sans
   tremblement sur téléphone — l'ancien décalage recalculé en JS à
   chaque image avait toujours un temps de retard sur le défilement
   natif). Le fond passe de la couleur de fond à celle des titres,
   le texte fait le chemin inverse au milieu du parcours. */
const START_BG = [251, 250, 248];
const END_BG = [61, 40, 31];
const START_TEXT = [61, 40, 31];
const END_TEXT = [251, 250, 248];

function useDayToNight() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const inner = innerRef.current;
    if (!section || !sticky || !inner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.height = 'auto';
      sticky.style.position = 'relative';
      sticky.style.backgroundColor = `rgb(${END_BG.join(',')})`;
      inner.style.color = `rgb(${END_TEXT.join(',')})`;
      inner.style.transform = 'none';
      setLit(true);
      return;
    }
    const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
    let lastLit = false;
    /* Abonné à la boucle de défilement du site (smoothScroll.ts) : rien
       ne tourne quand la page est immobile. Le défilement est natif et
       amorti par Lenis sur ordinateur : plus besoin de lisser ici. */
    return onScrollFrame(() => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;
      const traveled = Math.max(0, Math.min(total, -rect.top));
      const p = traveled / (total || 1);
      const c = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      sticky.style.backgroundColor = `rgb(${START_BG.map((v, i) => lerp(v, END_BG[i], c)).join(',')})`;
      const tp = Math.max(0, Math.min(1, (c - 0.42) / 0.16));
      inner.style.color = `rgb(${START_TEXT.map((v, i) => lerp(v, END_TEXT[i], tp)).join(',')})`;
      inner.style.transform = `scale(${0.94 + 0.06 * c})`;
      const lit = c > 0.55;
      if (lit !== lastLit) {
        lastLit = lit;
        setLit(lit);
      }
    });
  }, []);

  return { sectionRef, stickyRef, innerRef, lit };
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="lts-star" aria-hidden="true">
      <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.7 6 21l1.3-6.8-5-4.7 6.8-.8z" />
    </svg>
  );
}

export default function Home() {
  const { t, path } = useLang();
  const consent = useConsent();
  const [opening, setOpening] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const night = useDayToNight();
  const panelsRef = usePanelsSlideIn();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const reserve = async () => {
    setOpening(true);
    try {
      await openBooking({}, consent.measurement);
    } finally {
      setOpening(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={t('LAIT THYM SEL — Restaurant gastronomique à Angers')}
        description={t('Restaurant gastronomique étoilé à Angers, par Fanny et Gaëtan Morvan. Cuisine de saison, produits d’exception. Réservez votre table.')}
        canonicalPath="/"
      />

      {/* ── Hero : le diaporama, le titre, une preuve ────────────────
          Les photos du diaporama respirent lentement sous le fondu.
          Le titre monte ligne par ligne depuis un cache. En bas, à
          gauche l'adresse, à droite ce qui rassure avant de réserver. */}
      <section data-nav-theme="dark" className="lts-hero2 hero-grain">
        <div className="lts-hero2__bg">
          <HeroSlideshow primaryAlt={t('Salle du restaurant Lait Thym Sel dressée pour un dîner, à Angers')} />
        </div>
        <div className="lts-hero2__grain" aria-hidden="true" />
        <div className="lts-hero2__shade" aria-hidden="true" />

        {/* Lueur de bougie : visible seulement en ambiance « soir »
            (après le coucher du soleil à Angers, voir lib/ambiance.ts). */}
        <div className="lts-hero2__candle" aria-hidden="true" />

        <div className="lts-hero2__content">
          <h1 className="lts-hero-title">
            <span className="lts-line"><span className="lts-line__inner" style={{ ['--d' as string]: '70ms' }}>{t('Une table étoilée')}</span></span>
            <span className="lts-line"><span className="lts-line__inner" style={{ ['--d' as string]: '200ms' }}>{t('au cœur d’')}<em>{t('Angers')}</em></span></span>
          </h1>
          <p className="lts-hero-sub" style={{ ['--d' as string]: '520ms' }}>
            {t('Fanny & Gaëtan Morvan · Guide Michelin depuis 2019')}
          </p>
          <button
            type="button"
            onClick={reserve}
            disabled={opening}
            className={`lts-hero-cta ${scrolled ? 'is-hidden' : ''}`}
            style={{ ['--d' as string]: '760ms' }}
            data-testid="btn-hero-reserve"
          >
            {opening ? t('Ouverture…') : t('Réserver une table')}
          </button>
        </div>

        <p className="lts-hero2__corner lts-hero2__corner--left" style={{ ['--d' as string]: '1000ms' }}>
          {t('17 rue Boisnet · Angers · rive droite de la Maine')}
        </p>
        <p className="lts-hero2__corner lts-hero2__corner--right" style={{ ['--d' as string]: '1000ms' }}>
          <span className="lts-hero2__stars" aria-hidden="true"><Star /><Star /><Star /><Star /><Star /></span>
          <span className="lts-hero2__score">4,8</span>
          <span>{t('287 avis Google')}</span>
          <span className="lts-hero2__award">
            <img src="/badges/badge-michelin-etoile.png" alt="" width={22} height={22} />
            {t('Une étoile, depuis 2019')}
          </span>
        </p>
      </section>

      {/* ── 01 · Arriver : la maison en trois temps ──────────────────
          Trois panneaux pleine hauteur. Au survol (ou au toucher sur
          mobile), le texte se révèle et l'image zoome doucement.
          Entrée inspirée de princesayaiza.com : quand la rangée arrive
          à l'écran, les panneaux glissent depuis la droite, l'un après
          l'autre (voir `usePanelsSlideIn`). */}
      <section className="lts-sand py-16 md:py-24">
        <div className="lts-container">
          <Kicker number="01" align="center">{t('Premier temps · Arriver')}</Kicker>
          <Title before={t('La maison')} accent={t('en trois temps')} size="lg" align="center" />
          <p className="lts-lead reveal-fade mx-auto mt-6 max-w-2xl text-center">
            {t('Une maison angevine : la brique, la Maine à deux pas, les producteurs de l’Anjou dans l’assiette. Ce qui se passe avant que la première assiette n’arrive.')}
          </p>
          <div className="mt-10 flex justify-center"><Ornament kind="trio" /></div>
        </div>
        <div ref={panelsRef} className="lts-panels lts-slide-in mt-12 md:mt-16">
          {[
            { photo: STOCK.salleVitrail, alt: t('Une salle sous un vitrail, en fin de service'), position: '50% 55%', title: t('Le lieu'), sub: t('Une maison de brique, rue Boisnet'), text: t('Après six années dans la Doutre, nous avons traversé la Maine pour un lieu qui nous ressemble davantage : une cuisine ouverte, une salle intime, peu de tables.'), href: path('/a-propos'), cta: t('Découvrir la maison'), muted: false },
            { photo: STOCK.assiette, alt: t('Une assiette dressée, la sauce versée à la cuillère'), position: '50% 50%', title: t('La cuisine'), sub: t('Peu d’éléments, des cuissons justes'), text: t('Une cuisine de produits, construite au rythme des saisons et des arrivages de producteurs installés à quelques kilomètres d’Angers.'), href: path('/menus'), cta: t('Explorer la carte'), muted: false },
            { photo: STOCK.cuisine, alt: t('En cuisine, au passe, pendant le service'), position: '58% 50%', title: t('Le geste'), sub: t('La précision, assiette après assiette'), text: t('Une cuisine ouverte : vous voyez la mise en place, le dressage, le service. Rien n’est caché, rien n’est joué.'), href: path('/avis'), cta: t('Lire les avis'), muted: false },
          ].map((p, i) => (
            <PanelItem key={p.photo.src} {...p} index={i} />
          ))}
        </div>
        <p className="lts-swipe-hint" aria-hidden="true">{t('Faites glisser')} →</p>
      </section>

      {/* ── Immersion : Angers, en plein écran ───────────────────────
          La photo s'ouvre en se dézoomant pendant qu'on la traverse ;
          un mot géant la traverse en sens inverse. */}
      <section className="lts-immersion" data-scrub data-nav-theme="dark">
        <img
          src={STOCK.chateau.src}
          srcSet={STOCK.chateau.srcSet}
          sizes="100vw"
          alt={t('Angers, vue depuis les bords de la Maine')}
          loading="lazy"
          decoding="async"
          className="lts-immersion__img"
        />
        <div className="lts-immersion__grain" aria-hidden="true" />
        <div className="lts-immersion__shade" aria-hidden="true" />
        <span className="lts-immersion__word" aria-hidden="true">{t('Étincelles')}</span>
        <div className="lts-immersion__caption">
          <p className="lts-immersion__quote">
            {t('Lait, thym, sel.')} <em>{t('Trois mots simples, une cuisine droite.')}</em>
          </p>
          <p className="lts-immersion__meta">{t('17 rue Boisnet · Angers · rive droite de la Maine')}</p>
        </div>
      </section>

      {/* ── 02 · Reconnaître ───────────────────────────────────────── */}
      <section className="lts-sand-fade py-20 md:py-28">
        <div className="lts-container grid items-center gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Kicker number="02">{t('Deuxième temps · Reconnaître')}</Kicker>
            <Title before={t('Une table que le')} accent={t('Guide')} after={t('a remarquée')} sub={t('Étoilée depuis 2019')} />
            <p className="lts-text reveal-fade mt-7 max-w-[380px]">
              {t('Une étoile au Guide Michelin depuis 2019, une étoile verte pour l’engagement et trois toques au Gault & Millau. Pas une ligne dans un palmarès : une exigence que l’on retrouve à chaque service.')}
            </p>
            <div className="reveal-fade mt-10">
              <UnderlineLink href={path('/avis')} testId="link-home-reviews">{t('Lire tous les avis')}</UnderlineLink>
            </div>
            <div className="lts-divider mt-24" />
            <p className="lts-note max-w-[360px]">{t('« Plusieurs plats nous ont donné une grande émotion. » — avis Google, repris sur la page Avis.')}</p>
          </div>
          <div className="md:col-span-7">
            <div className="lts-badges">
              {[
                { src: '/badges/badge-michelin-etoile.png', label: t('Guide Michelin'), sub: t('Une étoile, depuis 2019') },
                { src: '/badges/badge-michelin-verte.png', label: t('Étoile verte'), sub: t('Gastronomie durable') },
                { src: '/badges/badge-gault-millau-toques.png', label: t('Gault & Millau'), sub: t('Trois toques') },
              ].map((b, i) => (
                <figure key={b.src} className={`lts-badge lts-badge--${i + 1} reveal-fade`} style={{ ['--reveal-delay' as string]: `${i * 140}ms` }}>
                  <img src={b.src} alt="" width={240} height={240} loading="lazy" />
                  <figcaption><strong>{b.label}</strong><span>{b.sub}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · Choisir : les menus ───────────────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <div className="lts-container">
          <Kicker number="03" align="center">{t('Troisième temps · Choisir')}</Kicker>
          <Title before={t('L’expérience')} accent={t('Lait Thym Sel')} size="lg" align="center" />
          <p className="lts-lead reveal-fade mx-auto mt-7 max-w-3xl text-center">
            {t('Un menu unique, de trois à neuf étincelles, qui suit la saison et les arrivages. Servi pour l’ensemble de la table, découvert assiette après assiette.')}
          </p>
          <ul className="lts-menus mx-auto mt-14 max-w-4xl">
            {MENUS_APERCU.map((m, i) => (
              <li key={m.name} className="menu-row reveal-fade" style={{ ['--reveal-delay' as string]: `${200 + i * 120}ms` }}>
                <Etincelles count={m.etincelles} label={t(`${m.etincelles} étincelles`)} />
                <span className="menu-row__name lts-menus__name">{m.name}</span>
                <span className="lts-menus__service">{t(m.service)}</span>
                <span className="lts-menus__prix">{m.prix}</span>
              </li>
            ))}
          </ul>
          <div className="reveal-fade mt-12 flex flex-col items-center gap-6 text-center" style={{ ['--reveal-delay' as string]: '420ms' }}>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              <button type="button" onClick={reserve} disabled={opening} className="lts-box lts-box--dark" data-testid="btn-home-reserve">
                <span>{opening ? t('Ouverture…') : t('Réserver une table')}</span><i aria-hidden="true">›</i>
              </button>
              <UnderlineLink href={path('/menus')} testId="link-home-menus">{t('Voir toute la carte')}</UnderlineLink>
            </div>
            <p className="lts-note max-w-md">{t('Service possible en une heure, le midi, pour celles et ceux qui disposent d’un temps limité.')}</p>
          </div>
        </div>
      </section>

      {/* ── 04 · Rencontrer : les chefs ────────────────────────────── */}
      <section className="bg-background py-12 md:py-20">
        <div className="lts-container grid items-center gap-12 md:grid-cols-12 md:gap-10">
          <div className="reveal-fade md:col-span-5">
            <figure className="lts-polaroid" data-scrub>
              <div className="lts-polaroid__stage">
                <img src={MAISON.chefs.src} srcSet={MAISON.chefs.srcSet} sizes="(max-width: 900px) 90vw, 40vw" alt={t('Fanny et Gaëtan Morvan, en veste de cuisine')} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span className="lts-script lts-script--static">{RESTAURANT.chefs}</span>
                <img src="/logos/logo-emblem-mark.png" alt="" width={44} height={44} loading="lazy" />
              </figcaption>
            </figure>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Kicker number="04">{t('Quatrième temps · Rencontrer')}</Kicker>
            <Title before={t('Fanny &')} accent={t('Gaëtan')} after={t('Morvan')} sub={t('Deux cuisiniers, une maison')} />
            <p className="lts-text reveal-fade mt-7 max-w-[420px]">{t('Fanny et Gaëtan Morvan se sont rencontrés dans les cuisines de grands établissements, avant de tout quitter pour ouvrir, en 2017, leur propre maison à Angers.')}</p>
            <p className="lts-text reveal-fade mt-4 max-w-[420px]" style={{ ['--reveal-delay' as string]: '120ms' }}>{t('Lait, thym, sel — trois mots simples pour une cuisine droite, exigeante et honnête. Étoilée Michelin depuis 2019.')}</p>
            <div className="reveal-fade mt-10" style={{ ['--reveal-delay' as string]: '220ms' }}>
              <UnderlineLink href={path('/a-propos')} testId="link-home-about">{t('Découvrir la maison')}</UnderlineLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Producteurs : ceux qui nous suivent depuis le début ───────
          L'étoile verte, prouvée par des noms. Liste reprise mot pour
          mot du site d'origine (lib/maison.ts). */}
      <section className="lts-producers">
        <div className="lts-container lts-producers__grid">
          <figure className="lts-producers__photo reveal-fade">
            <img src={STOCK.producteur.src} srcSet={STOCK.producteur.srcSet} sizes="(max-width: 900px) 70vw, 30vw" alt={t('Un maraîcher porte une caisse de salades fraîchement cueillies')} loading="lazy" decoding="async" />
          </figure>
          <div>
            <Ornament kind="thym" className="mb-6" />
            <Kicker>{t('Étoile verte · Nos producteurs')}</Kicker>
            <Title before={t('Ceux qui nous')} accent={t('suivent')} after={t('depuis le début')} />
            <p className="lts-text reveal-fade mt-7 max-w-[460px]">
              {t('Éleveurs, maraîchers, pêcheur de Loire, fromagers, vignerons : la plupart travaillent en Anjou, à quelques kilomètres de la rue Boisnet. Les menus prennent vie au fil de leurs saisons.')}
            </p>
            <ul className="lts-producers__list reveal-fade">
              {PRODUCTEURS.map((p) => (
                <li key={p.nom}>
                  <span className="lts-producers__name">{p.nom}</span>
                  {p.detail ? <span className="lts-producers__detail">{p.detail}</span> : null}
                  <span className="lts-producers__place">{p.lieu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Offrir : chèques et coffrets cadeaux ───────────────────── */}
      <section className="lts-gift">
        <div className="lts-container lts-gift__grid">
          <div className="lts-gift__photo reveal-fade">
            <img src={STOCK.fleursSechees.src} srcSet={STOCK.fleursSechees.srcSet} sizes="(max-width: 900px) 90vw, 40vw" alt={t('Des fleurs séchées dans un pichet blanc')} loading="lazy" decoding="async" />
          </div>
          <div>
            <Ornament kind="lait" className="mb-6" />
            <Kicker>{t('Offrir')}</Kicker>
            <Title before={t('Offrez une')} accent={t('parenthèse')} />
            <p className="lts-text reveal-fade mt-7 max-w-[420px]">
              {t('Faites plaisir à ceux que vous aimez en leur offrant Lait Thym Sel : chèques et coffrets cadeaux sont disponibles sur notre boutique en ligne.')}
            </p>
            <div className="reveal-fade mt-10">
              <UnderlineLink href={GIFT_SHOP_URL} external testId="link-home-gift">{t('Notre boutique')}</UnderlineLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · Rester : le soir ──────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="lts-container grid items-center gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Kicker number="05">{t('Cinquième temps · Rester')}</Kicker>
            <Title before={t('Quand la lumière')} accent={t('se tamise')} sub={t('Une atmosphère plus intime')} />
            <p className="lts-text reveal-fade mt-7 max-w-[400px]">{t('À la tombée du jour, la salle change de rythme. Peu de tables, une lumière basse, un service qui prend son temps. Le menu du soir se déroule en cinq, sept ou neuf étincelles.')}</p>
            <div className="reveal-fade mt-10">
              <button type="button" onClick={reserve} disabled={opening} className="lts-underline" data-testid="btn-home-reserve-evening">
                {opening ? t('Ouverture…') : t('Réserver pour le dîner')}
              </button>
            </div>
            <div className="lts-divider mt-20" />
            <p className="lts-note max-w-[360px]">{t('Dîner du mardi au samedi à partir de 19h30. Déjeuner le mercredi et le vendredi.')}</p>
          </div>
          <div className="reveal-fade md:col-span-7" style={{ ['--reveal-delay' as string]: '180ms' }}>
            <div className="lts-tilt" data-scrub>
              {[
                /* La soirée en trois images : la bougie, le vin versé, la
                   table sous la lampe. */
                { photo: STOCK.bougie, alt: t('Une bougie allumée sur une table, le soir') },
                { photo: STOCK.vin, alt: t('Le vin versé au verre, à table') },
                { photo: STOCK.lampe, alt: t('Une table dressée sous la lumière d’une lampe') },
              ].map((p, i) => (
                <div key={p.photo.src} className={`lts-tilt__card lts-tilt__card--${i + 1}`}>
                  <img src={p.photo.src} srcSet={p.photo.srcSet} sizes="(max-width: 900px) 40vw, 22vw" alt={p.alt} loading="lazy" decoding="async" />
                </div>
              ))}
              <div className="lts-tilt__note">
                <span className="lts-kicker">{t('Atmosphère du soir')}</span>
                <p>{t('Quand la lumière baisse, l’expérience devient plus intime : la présence, le lieu et le rythme se lisent autrement.')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · Réserver : du jour à la nuit ──────────────────────── */}
      <section ref={night.sectionRef} className="lts-night">
        <div aria-hidden="true" data-nav-theme="dark" className="lts-night__dark-marker" />
        <div ref={night.stickyRef} className="lts-night__sticky">
          <div ref={night.innerRef} className="lts-night__inner">
            <span className="lts-kicker lts-kicker--inherit">{t('Dernier temps · Réserver')}</span>
            <h2 className="lts-title lts-title--lg lts-title--inherit">
              {t('Dînez')} <em>{t('au cœur d’Angers')}</em>,<br />
              {t('dans un moment')} <em>{t('composé')}</em> {t('pour vous')}
            </h2>
            <p className="lts-night__body">{t('Nos disponibilités s’affichent en temps réel : votre table est confirmée immédiatement. De l’apéritif au dessert, chaque détail est pensé pour que la soirée vous appartienne.')}</p>
            <div className={`lts-night__actions ${night.lit ? 'is-visible' : ''}`}>
              <button type="button" onClick={reserve} disabled={opening} className="lts-btn" data-testid="btn-home-reserve-final">
                {opening ? t('Ouverture…') : t('Réserver votre table')}
              </button>
              <a href={RESTAURANT.phoneHref} className="lts-underline lts-underline--light" data-testid="link-reserve-call">
                <Phone className="mr-2 inline h-3.5 w-3.5" />
                {RESTAURANT.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/* Panneau de la section 01. Sur mobile, un toucher ouvre le panneau. */
function PanelItem({
  photo, alt, title, sub, text, href, cta, muted, index, position,
}: { photo: MaisonPhoto; alt: string; title: string; sub: string; text: string; href: string; cta: string; muted: boolean; index: number; position?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`lts-panel ${muted ? 'lts-panel--muted' : ''} ${open ? 'is-open' : ''}`}
      style={{ ['--i' as string]: index }}
      data-scrub
      onClick={() => setOpen((o) => !o)}
    >
      <img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 900px) 85vw, 33vw" alt={alt} loading="lazy" decoding="async" style={{ objectPosition: position }} />
      <div className="lts-panel__overlay">
        <div className="lts-panel__inner">
          <h3 className="lts-panel__title">{title}</h3>
          <span className="lts-script lts-script--light">{sub}</span>
          <div className="lts-panel__reveal">
            <p>{text}</p>
            <Link href={href} className="lts-ghost-btn" onClick={(e) => e.stopPropagation()}>{cta}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Entrée des panneaux, reprise de princesayaiza.com : ils attendent
   décalés d'une demi-largeur d'écran vers la droite, invisibles ; dès
   que la rangée entre à l'écran (une seule fois), ils glissent à leur
   place en 2 s, courbe « expo » (départ et arrivée lents), 0,1 s
   d'écart entre deux panneaux. Le CSS (`.lts-slide-in`) porte le
   mouvement ; ce hook pose seulement `data-in` sur la rangée. */
function usePanelsSlideIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      el.dataset.in = 'true';
      return;
    }
    el.dataset.armed = 'true';
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        el.dataset.in = 'true';
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
