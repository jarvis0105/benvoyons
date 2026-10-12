import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'wouter';

import { closeBooking, onBookingStateChange } from '@/lib/booking';
import { useDockedBookingWidget } from '@/lib/dockWidget';
import { stopScroll, startScroll } from '@/lib/smoothScroll';
import { useLang, stripLangPrefix } from '@/i18n';
import { RESTAURANT } from '@/lib/restaurant';

/* ────────────────────────────────────────────────────────────────
   Habillage du module de réservation.

   Par défaut, le SDK Zenchef pose son module comme un panneau qui
   flotte au bord de l'écran — correct, mais anecdotique pour un geste
   aussi important qu'une réservation. Ce composant l'entoure d'une
   vraie mise en scène : le reste du site s'efface (voile + flou),
   une carte ivoire se pose au centre avec le titre de la maison, et
   le module Zenchef vient s'y ancrer — repris du principe observé
   chez Café de la Paix, où « Réserver une table » ouvre une carte
   centrée sur fond assombri plutôt qu'un simple tiroir latéral.

   La page /reservation fait exception : le module y est déjà encastré
   dans la page elle-même (voir Reservation.tsx) — une modale
   par-dessus une page qui EST le formulaire de réservation serait
   absurde. Ce composant s'y désactive entièrement. */

export function BookingModal() {
  const { t } = useLang();
  const [location] = useLocation();
  const bare = stripLangPrefix(location);
  const isReservationPage = bare === '/reservation';

  const [open, setOpen] = useState(false);
  /* `render` survit à la fermeture le temps du fondu de sortie : sans
     lui, `open` repassant à false démonterait la modale instantanément
     et l'on ne verrait jamais la disparition. */
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);
  /* Le calage de l'iframe n'est armé qu'une fois la carte peinte,
     immobile ET le fondu terminé. Un fondu ne déplace rien (l'opacité
     n'affecte pas la mise en page), mais l'iframe n'étant pas un
     enfant de la carte, elle ne peut pas fondre avec elle : on la fait
     donc apparaître une fois la carte en place, ce qui évite de la
     voir surgir à pleine opacité sur une carte encore translucide. */
  const [anchored, setAnchored] = useState(false);
  const slot = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => onBookingStateChange(setOpen), []);

  const wanted = open && !isReservationPage;
  const active = render && !isReservationPage;

  useEffect(() => {
    if (wanted) {
      setRender(true);
      // Une frame d'écart entre le montage et la classe qui déclenche
      // le fondu : sans elle, l'élément naît déjà à son état final et
      // la transition ne joue pas.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    if (!render) return;
    setShown(false);
    setAnchored(false);
    const id = window.setTimeout(() => setRender(false), 300);
    return () => window.clearTimeout(id);
  }, [wanted, render]);

  useEffect(() => {
    if (!active || !shown) {
      setAnchored(false);
      return;
    }
    // 340 ms : la durée du fondu d'entrée, plus une marge.
    const id = window.setTimeout(() => setAnchored(true), 340);
    return () => window.clearTimeout(id);
  }, [active, shown]);

  useDockedBookingWidget(slot, active && anchored, 'fixed');

  // Verrouille le défilement de la page derrière la modale, et permet
  // de la refermer à la touche Échap — comportement attendu de tout
  // module qui recouvre le contenu.
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // `overflow:hidden` suffit à figer `window.scrollY`, mais on coupe
    // aussi le moteur de défilement lui-même — cohérent avec les
    // autres verrous du site (rideau, menu mobile, visionneuse).
    stopScroll();
    // Mémorise l'élément qui avait le focus pour le restituer à la
    // fermeture : sans cela, la navigation au clavier repart du haut
    // de la page.
    const restoreFocus = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBooking();
      else if (e.key === 'Tab') {
        const root = cardRef.current;
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
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`booking-modal ${shown ? 'booking-modal--shown' : ''} fixed inset-0 z-[100] flex md:items-center md:justify-center md:p-4 lg:p-6`}
    >
      <div
        className="booking-modal__backdrop absolute inset-0 bg-foreground/75 backdrop-blur-sm"
        onClick={() => closeBooking()}
        aria-hidden="true"
      />
      {/* La carte ne se déplace ni ne change d'échelle — jamais. Seule
          son OPACITÉ est animée : contrairement à une translation ou à
          un zoom, elle n'affecte pas la mise en page, donc les
          coordonnées sur lesquelles l'iframe est calée restent
          rigoureusement stables. C'est ce qui permet d'avoir un fondu
          sans faire trembler le module.

          DEUX MISES EN PAGE, pas une seule qu'on essaierait de faire
          tenir dans les deux cas :

          — Sur bureau (`md:` et au-delà), la carte flottante centrée,
            inchangée : largeur bornée à 520px, coins visibles,
            entourée du voile.

          — Sous 768px, une feuille plein écran (`h-[100dvh] w-full`,
            sans marge, sans coin visible) — inspirée du site de
            référence, dont le module de réservation occupe l'écran
            entier sur téléphone, sans le moindre vide autour. Sur un
            écran déjà petit, une carte centrée avec des marges de
            chaque côté réduit d'autant la hauteur utile du module —
            précisément l'espace qui manque le plus pour afficher un
            calendrier et une liste de créneaux. */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('Réservez votre table')}
        tabIndex={-1}
        data-lenis-prevent
        className="booking-modal__card relative flex h-[100dvh] w-full flex-col bg-background outline-none md:h-auto md:max-h-[94svh] md:w-full md:max-w-[520px] md:shadow-[0_30px_80px_rgba(20,14,10,0.35)]"
      >
        {/* En-tête : une seule rangée sur mobile (titre à gauche, croix
            à droite, comme sur la référence), un bloc centré classique
            sur bureau. Les deux boutons de fermeture qui suivent sont
            le même geste, rendu deux fois — chacun n'existe que sur
            son propre format (`md:hidden` / `hidden md:flex`) — parce
            que leur POSITION dans la mise en page diffère trop pour
            n'écrire qu'un seul élément à deux jeux de classes : sur
            mobile il est un élément normal de la rangée d'en-tête ; sur
            bureau il flotte en dehors de la carte, sur son coin
            supérieur droit. */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border/50 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:block md:border-none md:px-8 md:pb-5 md:pt-9 md:text-center">
          <h2 className="font-serif text-xl tracking-wide text-foreground md:text-[26px]">
            {t('Réservez votre table')}
          </h2>
          <button
            type="button"
            onClick={() => closeBooking()}
            aria-label={t('Fermer')}
            className="booking-modal-close flex h-10 w-10 shrink-0 items-center justify-center bg-brand-strong text-background hover:bg-brand hover:text-foreground md:hidden"
            data-testid="button-booking-modal-close-mobile"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Bouton de fermeture débordant en haut à droite, plein et
            carré, comme sur la référence : posé sur l'angle plutôt
            qu'à l'intérieur, il ne mange pas la largeur utile du
            module. Bureau uniquement — voir le commentaire ci-dessus. */}
        <button
          type="button"
          onClick={() => closeBooking()}
          aria-label={t('Fermer')}
          className="booking-modal-close absolute -top-5 -right-3 z-10 hidden h-11 w-11 items-center justify-center bg-brand-strong text-background hover:bg-brand hover:text-foreground md:-right-5 md:flex"
          data-testid="button-booking-modal-close-desktop"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Texte d'accueil, version bureau — complet.

            Sur la référence, ce paragraphe est À L'INTÉRIEUR du module
            vert : c'est un message configuré depuis le back-office
            Zenchef, pas du contenu de leur site. Nous ne pouvons pas
            l'y injecter — le module est un iframe servi par
            bookings.zenchef.com, et le navigateur interdit d'écrire
            dans un document venu d'un autre domaine.

            Il est donc placé juste au-dessus, dans la carte : l'effet
            à l'écran est le même (une phrase d'accueil puis les
            sélecteurs), et le texte reste modifiable ici, sans passer
            par Zenchef. Pour le faire apparaître DANS le bandeau, il
            faudrait le saisir dans le back-office Zenchef. */}
        <p className="hidden shrink-0 px-8 pb-6 text-sm leading-relaxed text-muted-foreground md:block">
          {t('Pour une table de plus de six convives ou une privatisation, appelez-nous directement au')}{' '}
          <a
            href={RESTAURANT.phoneHref}
            className="whitespace-nowrap text-foreground underline underline-offset-4 transition-colors hover:text-brand-strong"
            data-testid="link-booking-modal-phone-desktop"
          >
            {RESTAURANT.phone}
          </a>
          .
        </p>

        {/* Même information, condensée sur une ligne pour mobile : la
            référence n'a « aucun vide » sur son écran de réservation —
            chaque paragraphe qui prend de la place est un paragraphe
            que le module de réservation, lui, ne peut pas occuper. Une
            ligne fine plutôt que trois phrases, et le module récupère
            la quasi-totalité de l'écran (voir le conteneur juste après,
            en `flex-1`, sans hauteur fixée sur mobile). */}
        <p className="shrink-0 border-b border-border/30 px-5 py-2.5 text-xs text-muted-foreground md:hidden">
          {t('Plus de 6 couverts ou privatisation')} :{' '}
          <a
            href={RESTAURANT.phoneHref}
            className="whitespace-nowrap text-foreground underline underline-offset-4"
            data-testid="link-booking-modal-phone-mobile"
          >
            {RESTAURANT.phone}
          </a>
        </p>

        {/* Le module, encastré. Sur bureau : marge nette de part et
            d'autre, hauteur bornée — il se lit comme un panneau posé
            dans la page. Sur mobile : `flex-1`, sans marge ni hauteur
            fixe, pour qu'il occupe tout ce qu'il reste de la feuille
            plein écran une fois l'en-tête et la ligne de contact
            déduites — c'est la partie qui doit dominer l'écran, pas
            celle qui doit se faire discrète. */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-card md:mx-6 md:mb-8 md:h-[min(560px,64svh)] md:flex-none">
          <div ref={slot} className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
