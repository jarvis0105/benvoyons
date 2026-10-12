import { useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   Thème de l'en-tête, déterminé par ce qu'il survole réellement —
   et non plus seulement par la PAGE affichée.

   Avant : `onDarkHero` ne regardait que le nom de la route (« / » ou
   « /a-propos ») et un seuil de défilement fixe. Ça marchait pour un
   hero unique en haut de page, mais ratait tout le reste : la
   section Réservation (fond brun) ou le pied de page, plus bas dans
   CETTE MÊME page, ne faisaient pas partie du hero et repassaient le
   logo en foncé alors qu'ils sont, eux aussi, sombres.

   Ici, chaque section qui a besoin d'un logo clair porte
   `data-nav-theme="dark"` (voir Home.tsx, About.tsx, Footer.tsx...).
   Un unique IntersectionObserver les surveille toutes, avec une
   marge de lecture réduite à une ligne fine calée sur la hauteur de
   l'en-tête : dès qu'une section sombre croise cette ligne, le thème
   passe à 'dark' ; dès qu'aucune ne la croise plus, il repasse à
   'light'. Un seul observateur pour toute la page, quel que soit le
   nombre de sections marquées — pas un écouteur de scroll recalculé
   à chaque frame. */

export function useNavTheme(pathname: string, headerHeight = 104) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]'));
    if (targets.length === 0) {
      setTheme('light');
      return;
    }

    // Ensemble des sections sombres actuellement sous l'en-tête : un
    // Set plutôt qu'un booléen unique, pour rester juste même quand
    // deux sections sombres se chevauchent brièvement au défilement
    // (l'une ne doit pas effacer la présence de l'autre).
    const active = new Set<Element>();

    const recompute = () => setTheme(active.size > 0 ? 'dark' : 'light');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        }
        recompute();
      },
      {
        // Ligne d'observation réduite à la hauteur de l'en-tête, collée
        // au sommet du viewport : seul le passage d'une section sombre
        // DERRIÈRE l'en-tête compte, pas le reste de la page visible
        // en dessous.
        rootMargin: `0px 0px -${Math.max(window.innerHeight - headerHeight, 0)}px 0px`,
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // Re-scanné à chaque changement de route : les sections marquées ne
    // sont pas les mêmes d'une page à l'autre. `pathname` vient de
    // wouter (`useLocation`), réactif aux changements de route côté
    // client — `window.location.pathname` seul ne l'aurait pas été,
    // wouter ne rechargeant jamais la page.
  }, [headerHeight, pathname]);

  return theme;
}
