import { useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   En-tête qui s'efface vers le bas, revient vers le haut.

   Le CSS seul ne peut pas produire cet effet : il connaît la
   position de défilement, jamais son SENS. C'est pourtant le sens
   qui porte l'intention — descendre, c'est lire ; remonter, c'est
   chercher à naviguer.

   Trois garde-fous, sans lesquels l'effet devient pénible :

   — Un seuil de 90 px avant de masquer quoi que ce soit : sinon le
     moindre soubresaut en haut de page fait clignoter l'en-tête.

   — Un delta minimum de 6 px entre deux mesures : sur un pavé
     tactile, le défilement produit des micro-oscillations dans les
     deux sens, qui feraient osciller la barre.

   — L'en-tête réapparaît toujours quand un menu est ouvert ou qu'on
     revient tout en haut. */

export function useHeaderReveal(disabled = false) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }
    if (typeof window === 'undefined') return;

    let last = window.scrollY;
    let queued = false;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      queued = false;
      const y = window.scrollY;
      const delta = y - last;

      if (Math.abs(delta) < 6) return;
      last = y;

      if (y < 90) setHidden(false);
      else setHidden(delta > 0);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
    };
  }, [disabled]);

  return hidden;
}
