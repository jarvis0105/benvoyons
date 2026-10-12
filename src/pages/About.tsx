import { SEO } from "@/components/SEO";
import { STOCK } from '@/lib/stock';
import { LUXE } from '@/lib/maison';
import { Layout } from "@/components/layout/Layout";
import { Kicker, Title, UnderlineLink } from "@/components/editorial";
import { Ornament } from "@/components/Ornament";
import { useLang } from "@/i18n";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Notre histoire : cinq temps, comme sur l'accueil.

   01 Le duo → 02 Les parcours → 03 La rencontre → 04 Trois mots →
   05 Rue Boisnet, puis la galerie et l'invitation.

   Les photos sont celles de la maison (lib/maison.ts), servies en
   plusieurs tailles (srcSet). */

/* La galerie (grille 3 + 2) reprend la composition choisie à l'origine,
   case par case, avec une photo de la maison du même genre :
   (la case du potier prend la hauteur de l'assiette en large, à sa droite)
   dressage à la pince ; assiette en céramique et ombre de fleurs ; table
   dressée ; mains d'artisan au tour ; assiette dressée en large. Photos
   Unsplash en haute définition (lib/stock.ts), utilisées une seule fois. `position` recadre chaque photo dans sa case. */
const GALLERY = [
  { photo: STOCK.dressagePince, alt: 'Un chef dresse une assiette à la pince', ratio: 'aspect-[3/4]', position: '50% 55%' },
  { photo: STOCK.assietteOmbre, alt: 'Une assiette en céramique et l’ombre de fleurs séchées', ratio: 'aspect-[3/4]', position: '50% 50%' },
  { photo: STOCK.tableDressee, alt: 'Une longue table dressée pour le dîner', ratio: 'aspect-[3/4]', position: '50% 50%' },
  { photo: STOCK.potier, alt: 'Des mains façonnent un bol sur le tour', ratio: 'h-full', position: '50% 50%' },
  { photo: STOCK.assietteMinimale, alt: 'Une assiette dressée, sur céramique grise', ratio: 'aspect-[21/9]', position: '50% 50%', wide: true },
];

export default function About() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Notre Histoire — LAIT THYM SEL | Restaurant Angers")}
        description={t(
          "Découvrez l'histoire de Fanny et Gaëtan Morvan, le duo derrière Lait Thym Sel, restaurant gastronomique à Angers. Une cuisine droite, exigeante et honnête.",
        )}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section data-nav-theme="dark" className="lts-hero2 lts-hero2--page hero-grain">
        <div className="lts-hero2__bg">
          <img
            src={STOCK.aboutHero.src}
            srcSet={STOCK.aboutHero.srcSet}
            sizes="100vw"
            alt={t("Assiette de haute gastronomie, dans l'esprit de Lait Thym Sel")}
            width={2400}
            height={1600}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
        <div className="lts-hero2__shade" aria-hidden="true" />
        <div className="lts-hero2__content lts-hero2__content--low">
          <span className="lts-kicker lts-kicker--inherit">{t("Notre histoire · Angers")}</span>
          <Title as="h1" before={t("Deux cuisiniers,")} accent={t("une maison")} sub={t("Angevine depuis 2017")} size="xl" align="center" light />
        </div>
      </section>

      {/* ── 01 · Le duo ───────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="lts-container grid items-center gap-12 md:grid-cols-12 md:gap-10">
          <figure className="reveal-fade md:col-span-5 m-0" data-scrub>
            <div className="lts-frame aspect-[4/5]">
              <img
                src={STOCK.brigade.src}
                srcSet={STOCK.brigade.srcSet}
                sizes="(max-width: 900px) 92vw, 40vw"
                alt={t("Un cuisinier au dressage, sous les lampes de cuivre")}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: '50% 40%' }}
              />
            </div>
          </figure>
          <div className="md:col-span-6 md:col-start-7">
            <Kicker number="01">{t("Premier temps · Le duo")}</Kicker>
            <Title before={t("Avant d’être un restaurant,")} accent={t("une histoire de duo")} sub={t("Deux parcours, un même regard")} />
            <p className="lts-text reveal-fade mt-7 max-w-[440px]">
              {t("Avant d'être un restaurant, Lait Thym Sel est une histoire de duo. Deux parcours, deux sensibilités, un même niveau d'exigence.")}
            </p>
            <p className="lts-text reveal-fade mt-4 max-w-[440px]" style={{ ["--reveal-delay" as string]: "120ms" }}>
              {t("Fanny en pâtisserie et en salle, Gaëtan en cuisine : deux rôles distincts, un seul regard sur ce que doit être une table. C'est cette entente, plus qu'une recette ou une adresse, qui donne son identité à la maison.")}
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · Les parcours ─────────────────────────────────────── */}
      <section className="lts-sand py-16 md:py-24">
        <div className="lts-container">
          <Kicker number="02" align="center">{t("Deuxième temps · Les parcours")}</Kicker>
          <Title before={t("Fanny &")} accent={t("Gaëtan")} after={t("Morvan")} size="lg" align="center" />
          <div className="mx-auto mt-14 grid max-w-5xl items-center gap-12 md:grid-cols-12 md:gap-12">
            <div className="reveal-fade md:col-span-5">
              {/* Deux parcours, deux portraits : Fanny, puis Gaëtan. */}
              <div className="lts-duo">
                {[
                  { photo: LUXE.fanny, name: 'Fanny', alt: t("Fanny Morvan, en veste de cuisine") },
                  { photo: LUXE.gaetan, name: 'Gaëtan', alt: t("Gaëtan Morvan, en veste de cuisine") },
                ].map((c, i) => (
                  <figure key={c.name} className={`lts-polaroid lts-polaroid--portrait lts-duo__card lts-duo__card--${i + 1}`} data-scrub>
                    <div className="lts-polaroid__stage">
                      <img src={c.photo.src} srcSet={c.photo.srcSet} sizes="(max-width: 900px) 42vw, 18vw" alt={c.alt} loading="lazy" decoding="async" />
                    </div>
                    <figcaption>
                      <span className="lts-script lts-script--static">{c.name}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="grid gap-10 md:col-span-7">
              {[
                { name: 'Fanny Morvan', role: t("Pâtisserie, salle & accords sans alcool"), text: t("Née à Annecy, Fanny se forme entre Bonneville, Grenoble et Nice, puis s'ouvre au monde — Angleterre, Saint-Barthélemy, Courchevel. De cette itinérance naît une personnalité ambitieuse, précise, portée par un sens aigu du détail et du goût."), delay: 0 },
                { name: 'Gaëtan Morvan', role: t("Chef de cuisine"), text: t("Né à Angers, Gaëtan entre en cuisine à 15 ans, formé par Michel Guérard puis Alain Ducasse au Louis XV, avant Laurent Saudeau et le SaQuaNa à Honfleur. Une cuisine droite, exigeante et honnête, reconnue par le Guide Michelin depuis 2019."), delay: 140 },
              ].map((p) => (
                <article key={p.name} className="lts-word reveal-fade" style={{ ["--reveal-delay" as string]: `${p.delay}ms` }}>
                  <span className="lts-kicker">{p.role}</span>
                  <h3 className="lts-word__mot mt-3" style={{ fontSize: 'clamp(26px, 2.4vw, 34px)' }}>{p.name}</h3>
                  <p className="lts-text">{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · La rencontre (sombre) ─────────────────────────────── */}
      <section data-nav-theme="dark" className="bg-foreground text-background py-16 md:py-24">
        <div className="lts-container">
          <div className="max-w-3xl">
            <span className="lts-kicker lts-kicker--inherit">{t("Troisième temps · La rencontre")}</span>
            <h2 className="lts-title lts-title--lg lts-title--inherit">{t("Tout commence par")} <em>{t("une rencontre")}</em></h2>
          </div>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5">
              <span className="lts-date">{t("Shanghai")}</span>
              <p className="lts-text-light reveal-fade mt-5">
                {t("Entre Fanny et Gaëtan, la connexion est immédiate : la même exigence, la même curiosité, la même volonté de ne jamais faire les choses à moitié. Ensemble, ils quittent tout pour participer à l'ouverture du restaurant d'un chef étoilé — une expérience fondatrice qui scelle une conviction commune, celle de construire un jour leur propre maison.")}
              </p>
            </div>
            <figure className="reveal-fade md:col-span-7 m-0" style={{ ["--reveal-delay" as string]: "140ms" }} data-scrub>
              <div className="lts-frame aspect-[16/9]">
                <img src={LUXE.chefsEnCuisine.src} srcSet={LUXE.chefsEnCuisine.srcSet} sizes="(max-width: 900px) 92vw, 56vw" alt={t("Fanny et Gaëtan Morvan, côte à côte en cuisine")} loading="lazy" decoding="async" />
              </div>
            </figure>
            <figure className="reveal-fade md:col-span-7 m-0" data-scrub>
              <div className="lts-frame aspect-[16/9]">
                <img src={STOCK.lumiere.src} srcSet={STOCK.lumiere.srcSet} sizes="(max-width: 900px) 92vw, 56vw" alt={t("Un restaurant baigné de lumière naturelle")} loading="lazy" decoding="async" />
              </div>
            </figure>
            <div className="md:col-span-5 md:pt-6">
              <span className="lts-date">{t("2017 · Angers")}</span>
              <h3 className="lts-title lts-title--inherit mt-4" style={{ fontSize: 'clamp(24px, 2.2vw, 32px)' }}>{t("Construire notre propre maison.")}</h3>
              <p className="lts-text-light reveal-fade mt-5" style={{ ["--reveal-delay" as string]: "120ms" }}>
                {t("De retour en France, portés par cette aventure, ils ouvrent Lait Thym Sel dans le quartier historique de la Doutre. Une cuisine droite, exigeante et honnête — reconnue par le Guide Michelin dès 2019.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Trois mots ───────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="lts-container">
          <Kicker number="04" align="center">{t("Quatrième temps · Trois mots")}</Kicker>
          <Title before={t("Lait, thym, sel :")} accent={t("une cuisine")} size="lg" align="center" sub={t("Bien plus qu'un nom")} />
          <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
            {[
              { mot: "Lait", def: "La gourmandise, la douceur, le réconfort.", num: "I", orn: "lait" as const },
              { mot: "Thym", def: "La créativité, le caractère, l'élan aromatique.", num: "II", orn: "thym" as const },
              { mot: "Sel", def: "Le brut, le minéral, la concentration des saveurs.", num: "III", orn: "sel" as const },
            ].map((item, i) => (
              <div key={item.mot} className="lts-word reveal-fade" style={{ ["--reveal-delay" as string]: `${i * 150}ms` }}>
                <Ornament kind={item.orn} className="lts-word__orn" />
                <span className="lts-word__num">{item.num}</span>
                <h3 className="lts-word__mot">{t(item.mot)}</h3>
                <p className="lts-text">{t(item.def)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · Rue Boisnet (sombre) ─────────────────────────────── */}
      <section data-nav-theme="dark" className="bg-foreground text-background py-16 md:py-24">
        <div className="lts-container grid items-center gap-12 md:grid-cols-12 md:gap-10">
          <figure className="reveal-fade md:col-span-5 m-0" data-scrub>
            <div className="lts-frame aspect-[2/3]">
              <img src={STOCK.salle.src} srcSet={STOCK.salle.srcSet} sizes="(max-width: 900px) 92vw, 40vw" alt={t("Une salle élégante, boiseries et arches")} loading="lazy" decoding="async" />
            </div>
          </figure>
          <div className="md:col-span-6 md:col-start-7">
            <span className="lts-kicker lts-kicker--inherit">{t("Cinquième temps · Rue Boisnet")}</span>
            <h2 className="lts-title lts-title--lg lts-title--inherit">{t("Un lieu qui nous ressemble")} <em>{t("davantage")}</em></h2>
            <dl className="lts-dates">
              <div>
                <dt>{t("Décembre 2023")}</dt>
                <dd>{t("Après six années passées dans le quartier historique de la Doutre à Angers, nous avons choisi de franchir la Maine en décembre 2023, pour ouvrir un nouveau lieu — un lieu qui nous ressemble davantage.")}</dd>
              </div>
              <div>
                <dt>{t("Septembre 2025")}</dt>
                <dd>{t("En septembre 2025, un an et demi après notre installation, un dégât des eaux est venu tout arrêter. Ce coup d'arrêt brutal aurait pu nous abattre. Il nous a, au contraire, obligés à nous recentrer, à repenser notre organisation, et à renforcer l'identité de notre maison.")}</dd>
              </div>
              <div>
                <dt>{t("Aujourd’hui")}</dt>
                <dd>{t("Notre nouvelle maison, une élégante bâtisse en brique, a été transformée avec une attention redoublée. Chaque détail, chaque espace, chaque atmosphère reflète désormais pleinement notre personnalité et notre vision.")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ── Galerie ───────────────────────────────────────────────── */}
      <section id="galerie" className="lts-sand py-16 md:py-24">
        <div className="lts-container">
          <Kicker align="center">{t("Galerie")}</Kicker>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-3 gap-3 md:mt-10 md:gap-5">
            {GALLERY.map((img, i) => {
              const wide = Boolean(img.wide);
              return (
                <figure key={img.photo.src} className={cn('group m-0 h-full', wide && 'col-span-2')}>
                  <div className={cn('gallery-tile photo-breathe relative block w-full overflow-hidden bg-muted/30', img.ratio)} data-testid={`gallery-tile-${i}`}>
                    <img
                      src={img.photo.src}
                      srcSet={img.photo.srcSet}
                      sizes={wide ? '(max-width: 1023px) 64vw, 760px' : '(max-width: 1023px) 31vw, 368px'}
                      alt={t(img.alt)}
                      loading="lazy"
                      decoding="async"
                      style={{ ['--reveal-delay' as string]: `${(i % 3) * 120}ms`, objectPosition: img.position }}
                      className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="gallery-tile__glow" />
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Invitation ────────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="lts-container text-center">
          <Title before={t("Venez")} accent={t("voir")} after={t("par vous-même")} size="lg" align="center" sub={t("Dîner du mardi au samedi, déjeuner mercredi et vendredi")} />
          <div className="reveal-fade mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            <a href={path('/reservation')} className="lts-box lts-box--dark"><span>{t("Réserver une table")}</span><i aria-hidden="true">›</i></a>
            <UnderlineLink href={path('/menus')}>{t("Voir les menus")}</UnderlineLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}
