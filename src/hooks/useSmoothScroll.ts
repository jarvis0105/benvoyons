import { useEffect } from "react";
import { initSmoothScroll, destroySmoothScroll } from "@/lib/smoothScroll";

/**
 * Démarre le moteur de défilement fluide pour toute la durée de vie de
 * l'application. Appelé une seule fois, au niveau racine (App), pas
 * par page — la boucle doit survivre aux changements de route
 * client-side ; c'est `Layout.tsx` qui, lui, enregistre et désenregistre
 * le conteneur de contenu à chaque montage de page.
 */
export function useSmoothScroll() {
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);
}
