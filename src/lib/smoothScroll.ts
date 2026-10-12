import Lenis from 'lenis';

/* ────────────────────────────────────────────────────────────────
   Défilement.

   La page défile NATIVEMENT dans la fenêtre, comme sur n'importe quel
   site. `position: sticky` fonctionne donc : les scènes de l'accueil
   restent à l'écran pendant qu'on les traverse sans que rien ne soit
   recalculé à la main, et les éléments fixes (en-tête, modale, bandeau
   cookies) restent réellement fixes.

   Sur ordinateur (souris, pavé tactile), Lenis lisse la molette :
   chaque cran est amorti au lieu de sauter d'une centaine de pixels,
   ce qui rend les effets liés au défilement fluides. Sur écran tactile,
   le défilement du système est déjà fluide : Lenis n'est pas démarré.
   Il ne l'est pas non plus si le visiteur a demandé de réduire les
   animations.

   Une seule boucle de mise à jour pour tout le site : les effets liés
   au défilement s'y abonnent avec `onScrollFrame` au lieu de poser
   chacun leur propre écouteur.
   ──────────────────────────────────────────────────────────────── */

type FrameCallback = (y: number) => void;

let lenis: Lenis | null = null;
let started = false;
let rafId = 0;
const subscribers = new Set<FrameCallback>();

function emit() {
  rafId = 0;
  const y = window.scrollY;
  subscribers.forEach((cb) => cb(y));
}

/** Demande une mise à jour des effets à la prochaine image. */
export function requestScrollFrame() {
  if (typeof window === 'undefined') return;
  if (!rafId) rafId = requestAnimationFrame(emit);
}

/** S'abonne aux mises à jour du défilement. Renvoie la fonction de désabonnement. */
export function onScrollFrame(cb: FrameCallback): () => void {
  subscribers.add(cb);
  requestScrollFrame();
  return () => {
    subscribers.delete(cb);
  };
}

/** Démarre le défilement — appelé une seule fois, au montage de l'App. */
export function initSmoothScroll() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!reduced && finePointer) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      autoRaf: true,
      // Les zones qui défilent elles-mêmes (modale de réservation,
      // menu, visionneuse) gardent leur défilement natif.
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    // Lenis émet `scroll` depuis sa propre boucle, juste après avoir
    // déplacé la page : les effets sont mis à jour dans la même image.
    lenis.on('scroll', () => {
      if (rafId) cancelAnimationFrame(rafId);
      emit();
    });
  }

  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame);
  window.addEventListener('load', requestScrollFrame);
}

/** Conservé pour l'API de `useSmoothScroll` : le défilement vit aussi longtemps que l'application. */
export function destroySmoothScroll() {}

/** Bloque le défilement de la page (modale, menu plein écran, visionneuse). */
export function stopScroll() {
  lenis?.stop();
}

/** Rend le défilement. */
export function startScroll() {
  lenis?.start();
}

/** Remet la page en haut, sans animation (changement de page). */
export function resetScroll() {
  if (typeof window === 'undefined') return;
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  requestScrollFrame();
}

/**
 * Défilement animé jusqu'à un élément, ou jusqu'en haut de page si
 * `target` est omis (bouton « remonter », ancre). `offset` laisse la
 * place de l'en-tête.
 */
export function scrollToElement(target?: string | HTMLElement, offset = -96) {
  if (typeof window === 'undefined') return;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (target && !el) return;

  if (lenis) {
    lenis.scrollTo(el ?? 0, { offset: el ? offset : 0, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }

  const destination = el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, destination), behavior: reduced ? 'auto' : 'smooth' });
}
