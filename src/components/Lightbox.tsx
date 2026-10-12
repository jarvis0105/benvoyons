import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import { stopScroll, startScroll } from '@/lib/smoothScroll';
import { useLang } from '@/i18n';

/* ────────────────────────────────────────────────────────────────
   Visionneuse plein écran.

   Le site de référence ouvre ses photos dans une lightbox (fancybox) :
   on clique une vignette, l'écran s'assombrit, l'image s'affiche en
   grand et l'on navigue de l'une à l'autre. C'est l'effet le plus
   visible de leur galerie, et le plus utile — sur une mosaïque de
   vignettes, chaque photo mérite d'être vue en entier.

   Réimplémenté ici sans bibliothèque : fancybox impose jQuery, soit
   ~90 ko à télécharger pour un comportement qui tient en un
   composant. Rien de leur code n'est repris.

   Ce qui est traité, et qu'on oublie souvent dans ce genre de
   composant :
   — flèches clavier, Échap, clic sur le fond ;
   — balayage tactile horizontal ;
   — préchargement des images voisines, pour que la suivante soit
     déjà là au moment où on l'appelle ;
   — défilement de la page gelé (Lenis compris) ;
   — retour du focus sur la vignette d'origine à la fermeture, sans
     quoi la navigation au clavier repart du haut de la page. */

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
};

export function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const { t } = useLang();
  const dialog = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  // Sens du dernier déplacement : l'image entre par le côté d'où
  // elle vient, ce qui rend la navigation lisible plutôt que
  // clignotante.
  const [dir, setDir] = useState<'next' | 'prev'>('next');

  const go = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      setDir(delta > 0 ? 'next' : 'prev');
      // Modulo positif : on boucle dans les deux sens.
      onNavigate((index + delta + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const restoreFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    stopScroll();
    dialog.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const root = dialog.current;
        if (!root) return;
        const focusable = Array.from(
          root.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      startScroll();
      document.removeEventListener('keydown', onKey);
      restoreFocus?.focus?.();
    };
  }, [open, onClose, go]);

  // Préchargement des voisines : au moment où le visiteur clique la
  // flèche, l'image est déjà dans le cache du navigateur.
  useEffect(() => {
    if (index === null || images.length < 2) return;
    [1, -1].forEach((d) => {
      const neighbour = images[(index + d + images.length) % images.length];
      if (!neighbour) return;
      const img = new Image();
      img.src = neighbour.src;
    });
  }, [index, images]);

  if (index === null) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={current.caption ?? current.alt}
      tabIndex={-1}
      className="lightbox"
      data-testid="lightbox"
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        // 45 px : au-delà du tremblement d'un doigt posé, en deçà d'un
        // geste qui demanderait de traverser l'écran.
        if (start == null || end == null || Math.abs(end - start) < 45) return;
        go(end < start ? 1 : -1);
      }}
    >
      <div className="lightbox__backdrop" onClick={onClose} aria-hidden="true" />

      <button
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label={t('Fermer')}
        data-testid="button-lightbox-close"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => go(-1)}
            aria-label={t('Image précédente')}
            data-testid="button-lightbox-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => go(1)}
            aria-label={t('Image suivante')}
            data-testid="button-lightbox-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <figure className="lightbox__figure">
        <img
          /* La clé change à chaque image : React remonte le nœud, donc
             l'animation d'entrée rejoue. Sans elle, seule la source
             changerait et l'image apparaîtrait sans transition. */
          key={current.src}
          src={current.src}
          alt={current.alt}
          className={`lightbox__image lightbox__image--${dir}`}
          decoding="async"
        />
        <figcaption className="lightbox__caption">
          <span>{current.caption ?? current.alt}</span>
          {images.length > 1 && (
            <span className="lightbox__counter">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

/** Petit état partagé, pour éviter de le réécrire dans chaque page. */
export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null);
  return {
    index,
    open: (i: number) => setIndex(i),
    close: () => setIndex(null),
    navigate: (i: number) => setIndex(i),
  };
}
