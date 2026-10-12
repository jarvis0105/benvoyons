import { useEffect } from 'react';

import { onScrollFrame, requestScrollFrame } from '@/lib/smoothScroll';

/* ────────────────────────────────────────────────────────────────
   Parallaxes discrètes, sur tout le site.

   Chaque élément marqué `data-scrub` reçoit une variable CSS `--p` :
   0 quand il entre par le bas de l'écran, 1 quand il sort par le haut.
   Le CSS s'en sert pour décaler légèrement une image ou un cadre.

   Une seule boucle pour toutes les pages (celle de smoothScroll.ts) ;
   la liste des éléments est relue quand le contenu change (changement
   de page). Rien n'est écrit quand la valeur ne change pas, et rien
   ne tourne si le visiteur préfère réduire les animations. */

export function useScrub() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let nodes: HTMLElement[] = [];
    const last = new WeakMap<HTMLElement, string>();
    let collectQueued = false;

    const collect = () => {
      collectQueued = false;
      nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-scrub]'));
      requestScrollFrame();
    };
    collect();

    const mutations = new MutationObserver(() => {
      if (collectQueued) return;
      collectQueued = true;
      requestAnimationFrame(collect);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const off = onScrollFrame(() => {
      const vh = window.innerHeight;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) continue;
        const p = (vh - r.top) / (vh + r.height);
        const v = Math.max(0, Math.min(1, p)).toFixed(4);
        if (last.get(el) === v) continue;
        last.set(el, v);
        el.style.setProperty('--p', v);
      }
    });

    return () => {
      off();
      mutations.disconnect();
    };
  }, []);
}
