import { useEffect } from "react";

/* ────────────────────────────────────────────────────────────────
   Apparitions au défilement (voir le bloc « Apparitions au
   défilement » d'index.css pour les effets eux-mêmes).

   Un seul IntersectionObserver pour tout le site. Un élément reçoit
   `.in-view` au moment précis où son haut passe sous les 91 % de la
   hauteur de l'écran : l'animation se joue sous les yeux du visiteur,
   jamais avant, jamais en retard.

   Corrigé par rapport à la v9 :
   — plus de minuteur de secours par élément. Il révélait tout au bout
     de 1,2 s, y compris le bas de la page : arrivé là, il n'y avait
     plus rien à animer (mesuré : 29 éléments sur 30 sur l'accueil) ;
   — plus de délai de 3,2 s qui forçait l'état final en CSS et coupait
     les transitions en cours (l'effet « pop ») ;
   — les éléments déjà dépassés au moment de l'affichage (retour en
     arrière, rechargement au milieu de la page) sont montrés tout de
     suite, sans animation ;
   — le téléphone a aussi ses apparitions, plus courtes et plus
     discrètes (voir les variables `--reveal-*`).

   La sécurité ne dépend plus d'un minuteur : l'état caché n'existe
   que sous la classe `js-reveal`, posée dans index.html et retirée
   d'office si l'application ne démarre pas (voir `__ltsReady`).

   Les images chargées à la demande reçoivent `.is-loaded` à leur
   arrivée, pour se fondre au lieu de surgir. */

/* `.lift` : c'est le CACHE qui est observé, pas le titre. Le titre,
   descendu sous son cache (`overflow: hidden`), est entièrement rogné :
   le navigateur le considère comme invisible et ne signale jamais son
   arrivée à l'écran. En v9, ces titres n'apparaissaient qu'au bout du
   minuteur de secours (1,2 s) — l'effet « en retard ». */
const REVEAL_SELECTOR = [
  ".reveal-fade",
  ".reveal-section",
  ".reveal-mask",
  ".reveal-mask-left",
  ".lift",
  ".gallery-tile img",
].join(", ");

/** L'élément et, pour un cache `.lift`, les titres qu'il contient. */
function targets(el: Element): Element[] {
  return el.classList.contains("lift") ? [el, ...Array.from(el.children)] : [el];
}

declare global {
  interface Window {
    __ltsReady?: boolean;
  }
}

function collect(node: Node, selector: string): HTMLElement[] {
  if (!(node instanceof HTMLElement)) return [];
  const out: HTMLElement[] = [];
  if (node.matches(selector)) out.push(node);
  node.querySelectorAll<HTMLElement>(selector).forEach((el) => out.push(el));
  return out;
}

export function useScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    window.__ltsReady = true;

    /* ── Images : fondu à l'arrivée ─────────────────────────────── */
    const markLoaded = (img: HTMLImageElement) => img.classList.add("is-loaded");
    const onImageEvent = (e: Event) => {
      if (e.target instanceof HTMLImageElement) markLoaded(e.target);
    };
    // `load` et `error` ne remontent pas : on les capte à la descente.
    document.addEventListener("load", onImageEvent, true);
    document.addEventListener("error", onImageEvent, true);
    const sweepImages = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        if (img.complete) markLoaded(img);
      });
    };
    sweepImages(document);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      root.classList.remove("js-reveal");
      return () => {
        document.removeEventListener("load", onImageEvent, true);
        document.removeEventListener("error", onImageEvent, true);
      };
    }
    root.classList.add("js-reveal");

    /* ── Apparitions ────────────────────────────────────────────── */
    /* v10 : React réécrit l'attribut `class` à chaque rendu d'un
       élément dont la classe dépend de l'état (menu actif, panneau
       ouvert…). Il effaçait ainsi `in-view`, et l'élément redevenait
       invisible — d'où des blocs vides. On mémorise ce qui a été
       révélé et on remet la classe si elle disparaît. */
    const revealed = new WeakSet<Element>();
    const reveal = (el: Element) => {
      targets(el).forEach((t) => { t.classList.add("in-view"); revealed.add(t); });
      observer.unobserve(el);
    };
    const revealInstantly = (el: Element) => {
      const list = targets(el);
      list.forEach((t) => { t.classList.add("reveal-instant", "in-view"); revealed.add(t); });
      observer.unobserve(el);
      requestAnimationFrame(() => requestAnimationFrame(() => list.forEach((t) => t.classList.remove("reveal-instant"))));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target);
          // Déjà au-dessus de l'écran : on ne rejoue rien.
          else if (entry.boundingClientRect.bottom < 0) revealInstantly(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -9% 0px" },
    );

    const watch = (el: HTMLElement) => {
      if (el.classList.contains("in-view")) return;
      observer.observe(el);
    };
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(watch);

    // Changement de page, contenus montés plus tard : branchés d'office.
    const mutations = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "attributes") {
          if (revealed.has(m.target as Element) && !(m.target as Element).classList.contains("in-view")) {
            (m.target as Element).classList.add("in-view");
          }
          continue;
        }
        m.addedNodes.forEach((node) => {
          collect(node, REVEAL_SELECTOR).forEach(watch);
          if (node instanceof HTMLElement) sweepImages(node);
        });
        m.removedNodes.forEach((node) => {
          collect(node, REVEAL_SELECTOR).forEach((el) => observer.unobserve(el));
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("load", onImageEvent, true);
      document.removeEventListener("error", onImageEvent, true);
    };
  }, []);
}
