import { useRef, type ReactNode } from 'react';
import { useLocation } from 'wouter';

/* ────────────────────────────────────────────────────────────────
   Transition entre les pages.

   Le site de référence rejoue son rideau d'ouverture à CHAQUE
   navigation interne, pas seulement au premier chargement : sur
   `beforeunload`, il réapplique la classe qui couvre l'écran avant de
   charger la page suivante. C'est ce qui donne une identité cohérente
   au changement de page — on ne saute pas d'un document à l'autre, on
   tourne une page du même carnet.

   On reprend le principe, pas la durée. Leur rideau tient 3,1 s parce
   qu'il masque un VRAI rechargement réseau (site multi-pages, chaque
   clic recharge tout). Ici, la navigation est instantanée — React
   substitue le contenu en mémoire, rien ne recharge. Rejouer un
   rideau de plusieurs secondes à chaque clic ralentirait le site pour
   de faux : on imiterait une lenteur qui n'existe pas.

   Le voile est donc ramené à ~450 ms, sans logo ni texte — un simple
   passage de teinte, assez bref pour se sentir sans jamais se laisser
   attendre. Il est purement décoratif (`pointer-events-none`) : il ne
   bloque jamais un clic sur ce qu'il traverse.

   Le contenu, lui, continue de simplement apparaître en fondu (classe
   `.page-transition`, rejouée à chaque changement de `key`) : c'est
   la combinaison des deux — voile bref au-dessus, fondu du contenu
   en dessous — qui recrée la sensation de « page qui se recompose »
   du site de référence. */

export function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  /* Le voile ne doit jouer qu'au CHANGEMENT de route, jamais au tout
     premier affichage (IntroCurtain s'en charge déjà, en plus riche —
     les deux se superposeraient sinon) ni à un re-rendu sans rapport
     avec la navigation (langue, préférences...).

     On compare donc la route au rendu précédent plutôt que de se fier
     à « est-ce le premier rendu du composant ? », qui aurait basculé
     à `false` dès le tout premier rendu, quelle qu'en soit la cause. */
  const previousLocation = useRef<string | null>(null);
  const showVeil = previousLocation.current !== null && previousLocation.current !== location;
  previousLocation.current = location;

  return (
    <>
      {showVeil && (
        <div key={`veil-${location}`} className="route-veil" aria-hidden="true">
          {/* Le logo blanc, comme sur l'écran d'ouverture. */}
          <img src="/logos/logo-horizontal-blanc.png" alt="" className="route-veil__logo" />
        </div>
      )}
      <div key={location} className="page-transition">
        {children}
      </div>
    </>
  );
}
