import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/i18n';

/* Diaporama en fondu du hero d'accueil : plusieurs photos superposées
   en absolute et animées en opacité — jamais un changement de `src`,
   qui remplacerait le pixel instantanément sans transition possible.
   Toutes les images restent montées ; seule l'opacité de la photo
   active passe à 100%, les autres à 0%, avec une transition CSS de
   FADE_DURATION.

   Le diaporama alterne les salles du restaurant avec deux photos
   d'Angers (la Tapisserie de l'Apocalypse et une vue de la ville),
   pour ancrer la maison dans son lieu sans se limiter aux seules
   photos prises sur place. Il s'ouvre sur la Tapisserie, puis
   alterne lieu / maison plutôt que de grouper les photos par
   origine, avant de boucler. */
interface HeroSlide {
  desktopSrc: string;
  desktopSrcSet: string;
  mobileSrcSet: string;
  /* Dimensions intrinsèques réelles du fichier — évitent un décalage
     de mise en page (CLS) et laissent le navigateur calculer le bon
     ratio le temps que la photo charge. */
  width: number;
  height: number;
  /* Classe Tailwind object-position : chaque photo cadre son sujet
     à un endroit différent selon la composition d'origine. */
  objectPositionClassName: string;
  /* Légende affichée en bas de l'écran pendant que la photo est
     visible : le lieu, et le crédit quand la photo n'est pas de la
     maison. */
  caption?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    /* Ouverture du diaporama : la Tapisserie de l'Apocalypse ancre
       tout de suite la maison dans Angers, avant même la première
       photo de salle — l'ordre a été pensé pour alterner ensuite
       lieu / maison plutôt que de grouper les photos par origine. */
    desktopSrc:
      'https://www.destination-angers.com/app/uploads/destination-angers-tourisme/2024/01/thumbs/La_Tapisserie_de_l_Apocalypse-Copyright-Les_Conteurs-Destination_Angers-4302-1920px-1920x960-crop-1729082096.webp',
    desktopSrcSet:
      'https://www.destination-angers.com/app/uploads/destination-angers-tourisme/2024/01/thumbs/La_Tapisserie_de_l_Apocalypse-Copyright-Les_Conteurs-Destination_Angers-4302-1920px-1920x960-crop-1729082096.webp 1920w',
    mobileSrcSet:
      'https://www.destination-angers.com/app/uploads/destination-angers-tourisme/2024/01/thumbs/La_Tapisserie_de_l_Apocalypse-Copyright-Les_Conteurs-Destination_Angers-4302-1920px-1920x960-crop-1729082096.webp 1920w',
    width: 1920,
    height: 960,
    objectPositionClassName: 'object-center',
    caption: 'La Tapisserie de l’Apocalypse, château d’Angers · © Les Conteurs / Destination Angers',
  },
  {
    /* Le bar et la salle : bande haute (2000 × 1090) reprise telle
       quelle dans la photo source 2000 px (restaurant.webp), sans
       agrandissement ni accentuation — la version précédente était
       un agrandissement ×2 accentué, d'où les halos et le flou.
       Sur téléphone, un recadrage portrait dédié, centré sur la
       table et sur toute la hauteur disponible (1200 × 1333) : en
       `object-cover` sur un écran vertical, le bandeau large ne
       laissait voir qu'une mince tranche très agrandie. */
    desktopSrc: '/photos/hero-bar-comptoir.webp',
    desktopSrcSet:
      '/photos/hero-bar-comptoir-480.webp 480w, /photos/hero-bar-comptoir-960.webp 960w, /photos/hero-bar-comptoir-1440.webp 1440w, /photos/hero-bar-comptoir.webp 2000w',
    mobileSrcSet:
      '/photos/hero-bar-comptoir-mobile-480.webp 480w, /photos/hero-bar-comptoir-mobile-960.webp 960w, /photos/hero-bar-comptoir-mobile.webp 1200w',
    width: 2000,
    height: 1090,
    objectPositionClassName: 'object-center',
    caption: 'Le bar, rue Boisnet',
  },
  {
    desktopSrc:
      'https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0',
    desktopSrcSet:
      'https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0 1200w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0 1600w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0 2000w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0 2400w',
    mobileSrcSet:
      'https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0 1200w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0 1600w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0 2000w, https://images.unsplash.com/photo-1729699406028-56ab9e93b218?fm=jpg&q=85&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0 2400w',
    width: 2400,
    height: 1600,
    objectPositionClassName: 'object-center',
  },
  {
    /* Photo d'Angers — deuxième ancrage dans la ville, en écho à la
       Tapisserie qui ouvre le diaporama. */
    desktopSrc:
      'https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0',
    desktopSrcSet:
      'https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0 1200w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0 1600w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0 2000w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0 2400w',
    mobileSrcSet:
      'https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0 1200w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0 1600w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0 2000w, https://images.unsplash.com/photo-1660401023330-318f599edfa2?fm=jpg&q=85&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0 2400w',
    width: 2400,
    height: 1600,
    objectPositionClassName: 'object-center',
    caption: 'Le château d’Angers, au bord de la Maine',
  },
];

const SLIDE_DURATION_MS = 7200; // temps d'affichage de chaque photo — légèrement rallongé
const FADE_DURATION_MS = 1200; // doit correspondre à duration-[1200ms] plus bas

export function HeroSlideshow({ primaryAlt }: { primaryAlt: string }) {
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  /* Les photos suivantes ne sont demandées qu'une fois la page chargée
     (et la première affichée) : elles ne concurrencent plus la première
     image, et la première transition n'arrive qu'au bout de 7 s. */
  const [restReady, setRestReady] = useState(false);
  useEffect(() => {
    const arm = () => window.setTimeout(() => setRestReady(true), 600);
    if (document.readyState === 'complete') {
      const t = arm();
      return () => window.clearTimeout(t);
    }
    let t = 0;
    const onLoad = () => { t = arm(); };
    window.addEventListener('load', onLoad, { once: true });
    return () => { window.removeEventListener('load', onLoad); window.clearTimeout(t); };
  }, []);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;

    /* Respecte prefers-reduced-motion : la première photo reste
       affichée, sans rotation automatique. */
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const start = () => {
      intervalRef.current = setInterval(() => {
        setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
      }, SLIDE_DURATION_MS);
    };
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    /* Coupe le minuteur quand l'onglet passe en arrière-plan — pas de
       raison de continuer à faire tourner un fondu invisible. */
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <>
      {HERO_SLIDES.map((slide, i) => (i > 0 && !restReady ? null : (
        <picture key={slide.desktopSrc}>
          <source media="(max-width: 767px)" srcSet={slide.mobileSrcSet} />
          <img
            src={slide.desktopSrc}
            srcSet={slide.desktopSrcSet}
            sizes="100vw"
            alt={i === 0 ? primaryAlt : ''}
            width={slide.width}
            height={slide.height}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            className={cn(
              'absolute inset-0 h-full w-full object-cover [filter:contrast(1.08)_saturate(1.08)]',
              /* Fondu simple, sans zoom : le léger effet d'échelle
                 associé à l'opacité donnait un rendu de zoom
                 disgracieux à la transition — on garde uniquement le
                 fondu d'opacité, plus sobre. */
              'transition-opacity duration-[1200ms] ease-in-out',
              slide.objectPositionClassName,
              i === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        </picture>
      )))}
      <p className="lts-hero-caption" aria-live="off">
        {HERO_SLIDES.map((slide, i) => slide.caption && (
          <span key={slide.desktopSrc} className={i === activeIndex ? 'is-active' : ''}>{t(slide.caption)}</span>
        ))}
      </p>
    </>
  );
}
