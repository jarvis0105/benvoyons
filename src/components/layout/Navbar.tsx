import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ReserveButton } from "@/components/layout/ReserveButton";
import { useLang, stripLangPrefix } from "@/i18n";
import {
  RESTAURANT,
  ADDRESS_ONE_LINE,
  LUNCH,
  DINNER,
  LUNCH_DAYS_LABEL,
  DINNER_DAYS_LABEL,
  formatService,
} from "@/lib/restaurant";
import { stopScroll, startScroll } from "@/lib/smoothScroll";
import { Ornament } from "@/components/Ornament";
import { useNavTheme } from "@/hooks/useNavTheme";

/* Liens de navigation « métier » — ni Accueil (déjà atteint par un
   clic sur le logo) ni Réserver (qui a son propre bouton, à part) :
   ce sont les mêmes liens qu'on retrouve dans la barre centrée sur
   grand écran ET dans le panneau plein écran du menu mobile —
   Réserver s'ajoute uniquement dans ce second cas, comme dernier
   geste de la cascade. */
const NAV_LINKS = [
  { href: "/a-propos", label: "Restaurant" },
  { href: "/menus", label: "Menus" },
  { href: "/avis", label: "Avis" },
  { href: "/contact", label: "Contact" },
];

/* Sélecteur de langue : deux libellés textuels, FR puis EN, séparés
   d'une barre oblique — la même écriture que celle déjà en place au
   pied de page, plutôt qu'un globe et son panneau déroulant. Un
   globe est une icône à décoder ; « EN / FR » se lit tout de suite,
   et ce sont deux vrais liens <a hrefLang>, pas un menu piloté en
   JavaScript qui priverait les moteurs du lien vers la traduction. */
function LangSwitch({ onDark, className }: { onDark: boolean; className?: string }) {
  const { lang, otherLangHref, other } = useLang();

  return (
    <nav
      aria-label={lang === 'fr' ? 'Choisir la langue' : 'Choose language'}
      className={cn(
        /* Sur téléphone : version sobre — texte plus petit, espacements
           resserrés, opacité légèrement réduite — pour rester discret à
           côté du bouton Réserver et du bouton menu. Redevient la
           version normale (texte plus grand, pleine opacité) à partir de
           `sm`. */
        'hidden items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300 sm:flex',
        onDark ? 'hero-text-shadow text-white' : 'text-foreground',
        className,
      )}
    >
      {/* `cursor-pointer` posé sur les DEUX états, actif compris : FR
          et EN doivent se comporter comme deux boutons d'un même
          groupe au survol, même si cliquer sur la langue déjà active
          ne fait rien — sans ça, le curseur change de forme en
          passant de l'un à l'autre, ce qui donne l'impression que
          l'un des deux n'est pas interactif. */}
      <span className={cn('cursor-pointer', lang === 'fr' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-80')}>
        {lang === 'fr' ? (
          <span data-testid="link-lang-fr">FR</span>
        ) : (
          <Link href={otherLangHref} hrefLang={other} data-testid="link-lang-fr">FR</Link>
        )}
      </span>
      <span aria-hidden="true" className="opacity-40">/</span>
      <span className={cn('cursor-pointer', lang === 'en' ? 'opacity-100' : 'opacity-50 transition-opacity hover:opacity-80')}>
        {lang === 'en' ? (
          <span data-testid="link-lang-en">EN</span>
        ) : (
          <Link href={otherLangHref} hrefLang={other} data-testid="link-lang-en">EN</Link>
        )}
      </span>
    </nav>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { t, path, lang, otherLangHref, other } = useLang();
  const bare = stripLangPrefix(location);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    /* Seuil basé sur la hauteur d'écran (le hero fait ~100svh) plutôt
       qu'une valeur fixe de 60 px : l'en-tête étant TOUJOURS
       transparent (plus de plaque ivoire qui se pose derrière), le
       texte doit rester blanc tant que la photo sombre du hero est
       encore visible sous lui, et ne bascule en foncé qu'une fois
       qu'on l'a réellement quittée. */
    const handleScroll = () => {
      /* Seuil court : dès qu'on quitte le haut de page, l'en-tête
         se pose sur une plaque (claire ou sombre selon la section)
         pour que logo et liens restent lisibles sur tout contenu. */
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Les liens de navigation ne vivent QUE dans le hero : visibles tant
     qu'on ne l'a pas quitté, masqués dès qu'on passe ce seuil — quel
     que soit le sens du scroll. Avant, un déplacement vers le haut
     ailleurs sur la page les faisait réapparaître à tort ; ils sont
     désormais purement liés à la position (dans le hero ou non), plus
     à la direction du geste. */
  /* Les liens restent visibles sur toute la page : l'en-tête porte
     désormais sa propre plaque au défilement, ils y sont lisibles. */
  const navLinksVisible = true;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  /* Le panneau couvre tout l'écran : il faut donc verrouiller le
     défilement derrière lui, comme pour la modale de réservation.
     Lenis pilote le défilement du site et ignore `overflow: hidden`
     — il faut l'arrêter explicitement. */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      startScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  /* Thème de l'en-tête : déterminé par les sections réellement
     marquées `data-nav-theme="dark"` sur la page (voir useNavTheme).
     Couvre désormais le hero ET tout le reste de la page — la
     section Réservation, le pied de page — plutôt que le seul haut
     de page. */
  const sectionTheme = useNavTheme(bare, 104);

  /* Contact reste un cas à part : l'en-tête garde le logo et les
     liens en blanc tant que l'écran scindé est visible — le même
     traitement qu'un hero sombre, sans fond ni voile propres à cette
     page. */
  /* La page Contact garde un en-tête à texte foncé : sa moitié droite est claire. */
  const isContactSplitHero = false;
  const onDarkHero = sectionTheme === 'dark' || isContactSplitHero;
  /* Menu ouvert : l'en-tête est posé sur le panneau brun — logo,
     Réserver et croix passent en blanc, quelle que soit la section
     en dessous. */
  const navOnDark = onDarkHero || mobileMenuOpen;

  /* Le panneau plein écran du menu mobile, lui, s'ouvre TOUJOURS en
     sombre — c'est un fondu sombre posé sur le hero, quelle que soit
     la section survolée au moment du clic. */
  const mobileOnDark = true;

  return (
    <header
      className={cn(
        /* Hauteur à nouveau variable au scroll (104px → 86px desktop,
           92px → 76px mobile) : logo, bouton Réserver et sélecteur de
           langue suivent ce rétrécissement, comme avant. Les quatre
           liens de navigation, eux, ne sont plus dans ce flux — voir
           plus bas — ils restent fixés à la hauteur du hero. */
        "fixed top-0 left-0 right-0 z-50 flex items-center transition-[height,background-color,border-color] duration-300",
        isScrolled ? "h-[76px] md:h-[86px]" : "h-[92px] md:h-[104px]",
        /* Plaque au défilement : claire sur section claire, brune sur
           section sombre, toujours légèrement translucide et floutée. */
        (isScrolled || bare === "/contact") && !mobileMenuOpen
          ? navOnDark
            ? "border-b border-background/10 bg-foreground/95"
            : "border-b border-foreground/10 bg-background/95"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Les liens de navigation, sortis du flux qui suit le
          rétrécissement de l'en-tête : positionnés en `fixed` avec un
          `top` constant (la moitié de la hauteur du hero, 104px/2),
          ils ne bougent plus au scroll — contrairement au logo, au
          bouton Réserver et au sélecteur de langue, qui restent dans
          l'en-tête et suivent, eux, son changement de hauteur.
          Masqué en dessous de `xl` : sur téléphone/tablette, c'est le
          menu plein écran qui porte ces mêmes liens. */}
      {/* z-[70], au-dessus du bandeau logo/actions (z-[60]) qui suit
          juste après dans le DOM : à égalité de z-index, c'est ce
          bandeau — dont la boîte s'étend sur toute la largeur de
          l'en-tête à cause de `justify-between`, y compris l'espace
          vide entre le logo et les boutons — qui aurait autrement
          intercepté le clic destiné aux liens, alors même qu'ils
          restent visuellement au même endroit. */}

      {/* Pleine largeur avec une simple marge, au lieu d'un
          `container mx-auto` : celui-ci centre son contenu et applique
          une gouttière calculée, ce qui décalait le logo du bord de
          l'écran — d'autant plus nettement sur grand écran. Ici, il
          est réellement aligné à gauche, et le bouton de réservation
          à droite. */}
      <div className="relative z-[60] w-full px-5 md:px-8">
        <div className="relative flex items-center justify-between gap-4">
          {/* Gauche : le nom de la maison, seul. */}
          <Link
            href={path("/")}
            className="inline-flex items-center"
            data-testid="link-home-logo"
          >
            {/* Le logo officiel de la maison, en une seule image plutôt
                qu'une icône et un libellé composés séparément — c'est
                la version exacte fournie par la maison qui s'affiche,
                jamais une reconstitution typographique. Deux fichiers
                se relaient selon `navOnDark` (dérivé de `useNavTheme`) :
                lettrage blanc sur section sombre, lettrage foncé sur
                fond clair — chacun garde l'emblème dans sa teinte de
                marque d'origine, seul le texte du logo change de
                couleur d'un fichier à l'autre. Un `<img>` unique
                (jamais deux superposées à faire alterner en opacité) :
                la transition de 400 ms sur `opacity` suffit à adoucir
                le changement de fichier au passage d'une section à
                l'autre. Pas d'effet au survol : le logo reste
                strictement statique, quel que soit le pointeur. */}
            <div className="relative flex h-9 items-center sm:h-11 md:h-14">
              {/* Deux images superposées, chacune s'effaçant vers
                  l'autre en opacité (400 ms) plutôt qu'un `<img>`
                  unique dont on change la source : un changement de
                  `src` remplace le pixel instantanément, sans transition
                  possible — la seule façon d'obtenir un vrai fondu
                  entre les deux fichiers est de les garder tous deux
                  montés, superposés, et de piloter leur opacité
                  respective. La largeur de référence (`invisible`, non
                  affichée) fixe la place occupée par le logo dans la
                  mise en page, pour que les deux versions absolues
                  s'y calent sans jamais faire sauter le reste de
                  l'en-tête. */}
              <img
                src="/logos/logo-fonce-total.png"
                alt="Lait Thym Sel — Fanny & Gaëtan Morvan"
                className="invisible h-full w-auto object-contain"
                aria-hidden="true"
              />
              <img
                src="/logos/logo-fonce-total.png"
                alt="Lait Thym Sel — Fanny & Gaëtan Morvan"
                className={cn(
                  'absolute inset-0 block h-full w-auto object-contain transition-opacity duration-[400ms] ease',
                  navOnDark ? 'opacity-0' : 'opacity-100',
                )}
              />
              <img
                src="/logos/logo-horizontal-blanc.png"
                alt=""
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 block h-full w-auto object-contain transition-opacity duration-[400ms] ease',
                  navOnDark ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          </Link>

          {/* Droite : langue, réserver, puis — seulement sur
              téléphone — le bouton qui ouvre le panneau plein écran.
              Plus de bouton flottant qui suit le défilement : ce
              bouton-ci, toujours à la même place dans l'en-tête,
              suffit. */}
          <div className="flex items-center gap-4 sm:gap-5 md:gap-7">
            <LangSwitch onDark={navOnDark} />
            {/* Sur téléphone, l'en-tête ne garde que le logo et le menu :
                Réserver est dans le menu. */}
            <ReserveButton onDarkHero={navOnDark} className="hidden md:inline-flex" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'toggle-nav group relative -mr-3 inline-flex h-12 min-w-12 items-center justify-center px-3 transition-opacity duration-300 xl:hidden',
                mobileMenuOpen && 'is-open',
              )}
              data-testid="button-mobile-menu"
              aria-label={mobileMenuOpen ? t('Fermer') : t('Menu')}
              aria-expanded={mobileMenuOpen}
            >
              {/* Inspiré d'Hotel Aurelia : trois traits fins de même
                  longueur, sans texte sur téléphone ; ils se croisent en X
                  à l'ouverture (le trait du milieu s'efface). Le mot
                  « Menu » n'apparaît qu'à partir de la tablette. */}
              <span className={cn('toggle-nav__label', navOnDark ? 'text-white' : 'text-foreground')} aria-hidden="true">
                {mobileMenuOpen ? t('Fermer') : t('Menu')}
              </span>
              <svg
                viewBox="0 0 22 14"
                width="22"
                height="14"
                aria-hidden="true"
                className={cn(
                  'relative block overflow-visible',
                  navOnDark ? 'text-white' : 'text-foreground',
                )}
              >
                <line x1="0" y1="1" x2="22" y2="1" className="toggle-nav__bar toggle-nav__bar--1" />
                <line x1="0" y1="7" x2="22" y2="7" className="toggle-nav__bar toggle-nav__bar--2" />
                <line x1="0" y1="13" x2="22" y2="13" className="toggle-nav__bar toggle-nav__bar--3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <nav
        aria-label={t('Navigation')}
        className={cn(
          'fixed left-1/2 top-[52px] z-[70] hidden -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-300 ease-out xl:block',
          navLinksVisible ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95',
        )}
      >
        <ul className="flex items-center gap-12 2xl:gap-16">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {/* Même traitement visuel par défaut quelle que soit la
                  page active : pas de surlignement du lien courant.
                  Le survol se limite à un léger changement d'opacité —
                  sobre, sans trait ni fond. */}
              <Link
                href={path(link.href)}
                className={cn(
                  'font-nav text-[16px] tracking-[0.1em] transition-opacity duration-300 hover:opacity-70',
                  navOnDark ? 'hero-text-shadow text-white' : 'text-foreground',
                )}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Panneau plein écran du menu (inspiré de thelargo.com) : une
          photo de la salle floutée sous un voile sombre ; à gauche la
          navigation en grands caractères, à droite le contact et les
          horaires, chaque bloc titré en petites capitales. Tout entre en
          cascade (80 ms d'écart) ; à la fermeture, plus de délai. */}
      <div
        data-lenis-prevent
        inert={!mobileMenuOpen}
        className={cn("lts-menu", mobileMenuOpen && "is-open")}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="lts-menu__bg" aria-hidden="true" />
        <div className="lts-menu__veil" aria-hidden="true" />
        <div className="lts-menu__scroll">
          <div className="lts-container lts-menu__grid">
            <div className="lts-menu__col">
              <p className="lts-menu__label lts-menu__item" style={{ ['--d' as string]: '0ms' }}>{t('Navigation')}</p>
              <nav>
                <ul className="lts-menu__links">
                  {[...NAV_LINKS, { href: "/reservation", label: "Réserver" }].map((link, i) => (
                    <li key={link.href} className="lts-menu__item" style={{ ['--d' as string]: `${80 + i * 80}ms` }}>
                      <Link
                        href={path(link.href)}
                        className="lts-menu__link"
                        data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                      >
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="lts-menu__col lts-menu__col--info">
              <p className="lts-menu__label lts-menu__item" style={{ ['--d' as string]: '480ms' }}>{t('Contact & horaires')}</p>
              <dl className="lts-menu__info">
                <div className="lts-menu__item" style={{ ['--d' as string]: '560ms' }}>
                  <dt>{t('Adresse')}</dt>
                  <dd>{ADDRESS_ONE_LINE}</dd>
                </div>
                <div className="lts-menu__item" style={{ ['--d' as string]: '640ms' }}>
                  <dt>{t('Téléphone')}</dt>
                  <dd><a href={RESTAURANT.phoneHref} data-testid="link-mobile-nav-phone">{RESTAURANT.phone}</a></dd>
                </div>
                <div className="lts-menu__item" style={{ ['--d' as string]: '720ms' }}>
                  <dt>{t('E-mail')}</dt>
                  <dd><a href={`mailto:${RESTAURANT.email}`} data-testid="link-mobile-nav-email">{RESTAURANT.email}</a></dd>
                </div>
                <div className="lts-menu__item" style={{ ['--d' as string]: '800ms' }}>
                  <dt>{t('Horaires')}</dt>
                  <dd>
                    {t('Déjeuner')} · {t(LUNCH_DAYS_LABEL)}, {t(formatService(LUNCH))}<br />
                    {t('Dîner')} · {t(DINNER_DAYS_LABEL)}, {t(formatService(DINNER))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="lts-menu__orn lts-menu__item" style={{ ['--d' as string]: '960ms' }}>
            <Ornament kind="trio" tone="light" />
          </div>
        </div>
      </div>
    </header>
  );
}
