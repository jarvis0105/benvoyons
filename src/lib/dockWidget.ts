import { useEffect, type RefObject } from 'react';

/* ────────────────────────────────────────────────────────────────
   Ancrage du module de réservation dans la page.

   Le SDK Zenchef crée son iframe en `position: fixed`, collée au
   bord de l'écran, et l'attache lui-même à <body>. On ne peut ni
   choisir son parent, ni la déplacer dans le DOM sans provoquer un
   rechargement de l'iframe (et donc la perte de la saisie en
   cours).

   La solution retenue ne déplace rien dans le DOM : on repositionne
   l'iframe en `position: absolute`, à la place exacte d'un
   emplacement réservé dans la page, en coordonnées document (et non
   viewport). Une fois posée, elle défile avec la page comme un
   iframe classique (à la 1001menus) : aucun recalcul à chaque frame,
   donc aucune animation ni décalage visible au scroll.

   On corrige la position uniquement quand c'est nécessaire : au
   montage, sur redimensionnement de l'emplacement (ResizeObserver),
   sur resize fenêtre, et si le SDK réapplique son propre style plus
   tard (MutationObserver sur l'attribut style — le SDK gère par
   ailleurs lui-même les redirections de paiement et d'empreinte
   bancaire, donc on ne touche qu'au positionnement).

   Dégradation gracieuse : si le sélecteur ne trouve rien — SDK
   bloqué, version modifiée, structure changée — la fonction ne
   fait rien et le module reprend son comportement flottant par
   défaut. Rien ne casse.
   ──────────────────────────────────────────────────────────────── */

const IFRAME_SELECTOR = 'iframe[src*="bookings.zenchef.com"]';

function findWidgetIframe(): HTMLIFrameElement | null {
  return document.querySelector<HTMLIFrameElement>(IFRAME_SELECTOR);
}

/* Deux façons d'ancrer l'iframe, selon le contexte :

   — 'absolute' : l'emplacement fait partie du flux de la page (page
     /reservation). L'iframe est posée en coordonnées DOCUMENT et
     défile naturellement avec le reste.

   — 'fixed' : l'emplacement est lui-même dans un conteneur
     `position: fixed` (la modale). L'iframe doit alors être calée en
     coordonnées VIEWPORT. C'est indispensable : en 'absolute', on
     ajoute le scroll de la page à la position — or dans une modale le
     scroll du body est verrouillé et la carte ne bouge pas avec lui,
     donc l'iframe se retrouvait décalée de la hauteur de défilement,
     puis « rattrapait » sa position à chaque correction. C'est ce qui
     produisait le tremblement observé à l'ouverture. */
type DockMode = 'absolute' | 'fixed';

export function useDockedBookingWidget(
  placeholder: RefObject<HTMLElement | null>,
  enabled = true,
  mode: DockMode = 'absolute',
) {
  useEffect(() => {
    if (!enabled) return;

    let waitId = 0;
    let syncId = 0;
    let docked: HTMLIFrameElement | null = null;
    const previous = new Map<HTMLIFrameElement, string>();

    // Recalé à CHAQUE frame, tant que le hook est actif — et non plus
    // seulement au montage, au redimensionnement ou quand le SDK
    // retouche son propre style.
    //
    // La version précédente ne recalait qu'à ces trois occasions,
    // pari valable pour un emplacement en flux normal (`position:
    // absolute` + coordonnées document, qui restent justes sans rien
    // recalculer, page qui défile). Il s'effondre dès que l'emplacement
    // devient lui-même `position: sticky` (voir Reservation.tsx) : une
    // fois « collé », son rectangle-écran cesse de bouger alors que le
    // défilement, lui, continue — l'ancienne formule (rect + scrollY)
    // dérivait donc de plus en plus loin de la position réelle du
    // cadre, exactement le décalage remonté à l'usage.
    //
    // Une boucle `requestAnimationFrame` continue — déjà le parti pris
    // du module flottant de l'accueil (`useFloatingBookingAnchor`
    // ci-dessous) — élimine cette dérive par construction : elle ne
    // suppose jamais que la position reste valide entre deux frames,
    // elle la relit à chaque fois. Le coût (une lecture de
    // `getBoundingClientRect` par frame, uniquement pendant que cette
    // page est ouverte) est négligeable à côté de la fiabilité gagnée.
    const applyPosition = () => {
      const target = placeholder.current;
      const iframe = findWidgetIframe();
      if (!iframe || !target) return;

      if (!previous.has(iframe)) {
        previous.set(iframe, iframe.getAttribute('style') ?? '');
      }
      // Le module de Zenchef n'a pas de titre : les lecteurs d'écran
      // l'annonceraient comme un cadre anonyme.
      if (!iframe.title) iframe.title = 'Réservation (Zenchef)';
      docked = iframe;

      const rect = target.getBoundingClientRect();
      const style = iframe.style;

      // En mode 'fixed', les coordonnées du rect sont déjà celles du
      // viewport : on ne leur ajoute surtout pas le scroll.
      const offsetY = mode === 'fixed' ? 0 : window.scrollY;
      const offsetX = mode === 'fixed' ? 0 : window.scrollX;

      style.setProperty('position', mode, 'important');
      style.setProperty('top', `${Math.round(rect.top + offsetY)}px`, 'important');
      style.setProperty('left', `${Math.round(rect.left + offsetX)}px`, 'important');
      style.setProperty('right', 'auto', 'important');
      style.setProperty('bottom', 'auto', 'important');
      style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
      style.setProperty('height', `${Math.round(rect.height)}px`, 'important');
      style.setProperty('max-height', 'none', 'important');
      style.setProperty('max-width', 'none', 'important');
      style.setProperty('clip-path', 'none', 'important');
      style.setProperty('transform', 'none', 'important');
      style.setProperty('transition', 'opacity 220ms ease', 'important');

      iframe.dataset.ltsDocked = 'true';
    };

    // On attend que le SDK ait injecté son iframe avant de la caler.
    const waitForIframe = () => {
      const iframe = findWidgetIframe();
      if (!iframe) {
        waitId = window.requestAnimationFrame(waitForIframe);
        return;
      }
      const loop = () => {
        applyPosition();
        syncId = window.requestAnimationFrame(loop);
      };
      loop();
    };
    waitId = window.requestAnimationFrame(waitForIframe);

    /* Filet de sécurité : si le calage n'a jamais lieu (SDK qui change
       de structure, sélecteur qui ne trouve plus rien), on révèle
       l'iframe au bout de 3 s plutôt que de laisser le visiteur devant
       un cadre vide. Mieux vaut un module mal placé qu'un module
       absent. */
    const revealFallback = window.setTimeout(() => {
      const iframe = findWidgetIframe();
      if (iframe && !iframe.dataset.ltsDocked) iframe.dataset.ltsDocked = 'true';
    }, 3000);

    return () => {
      window.cancelAnimationFrame(waitId);
      window.cancelAnimationFrame(syncId);
      window.clearTimeout(revealFallback);
      // On rend au SDK son positionnement d'origine en quittant la page.
      if (docked) {
        // L'iframe redevient masquée : à la réouverture, elle sera de
        // nouveau révélée seulement une fois recalée.
        delete docked.dataset.ltsDocked;
        const original = previous.get(docked);
        if (original) docked.setAttribute('style', original);
        else docked.removeAttribute('style');
      }
    };
  }, [placeholder, enabled, mode]);
}

/* ────────────────────────────────────────────────────────────────
   Positionnement du module flottant.

   Sur la page d'accueil, le module n'est pas encastré dans la page :
   il flotte. Par défaut le SDK le colle en bas à droite de l'écran,
   où il recouvre les boutons du hero. On le remonte pour que son bord
   inférieur passe juste au-dessus du bouton « Réserver une table »,
   en le gardant aligné à droite.

   La valeur est bornée : sur un écran court, un décalage calculé sur
   la position du bouton ferait sortir le haut du module de l'écran.
   ──────────────────────────────────────────────────────────────── */

const GAP = 16;
const SIDE = 24;

export function useFloatingBookingAnchor(
  anchor: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    let frameId = 0;
    let moved: HTMLIFrameElement | null = null;
    const previous = new Map<HTMLIFrameElement, string>();

    const sync = () => {
      const iframe = findWidgetIframe();

      if (iframe) {
        if (!previous.has(iframe)) {
          previous.set(iframe, iframe.getAttribute('style') ?? '');
        }
        moved = iframe;

        const height = iframe.getBoundingClientRect().height || 600;
        const target = anchor.current;

        // Bord inférieur du module = juste au-dessus du bouton.
        let bottom = target
          ? window.innerHeight - target.getBoundingClientRect().top + GAP
          : GAP * 4;

        // On ne laisse jamais le haut du module sortir de l'écran.
        const maxBottom = Math.max(GAP, window.innerHeight - height - GAP);
        bottom = Math.min(bottom, maxBottom);

        const style = iframe.style;
        style.setProperty('position', 'fixed', 'important');
        style.setProperty('right', `${SIDE}px`, 'important');
        style.setProperty('left', 'auto', 'important');
        style.setProperty('top', 'auto', 'important');
        style.setProperty('bottom', `${Math.round(bottom)}px`, 'important');
      }

      frameId = window.requestAnimationFrame(sync);
    };

    frameId = window.requestAnimationFrame(sync);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (moved) {
        const original = previous.get(moved);
        if (original) moved.setAttribute('style', original);
        else moved.removeAttribute('style');
      }
    };
  }, [anchor, enabled]);
}
