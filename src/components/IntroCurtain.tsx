import { useEffect, useState } from 'react';

import { stopScroll, startScroll } from '@/lib/smoothScroll';

/* ────────────────────────────────────────────────────────────────
   Rideau d'ouverture (v10) — inspiré de princesayaiza.com.

   Court et sobre : le brun de la maison, le logo blanc au centre qui
   apparaît ; un instant, puis le logo s'efface (0,25 s) et le fond se
   dissout (0,8 s) sur la page, dont le titre monte pendant ce temps.

   Un clic ou une touche écourte. Une fois par session, jamais au
   rechargement, jamais si le visiteur préfère les mouvements réduits.
   `SHOW_INTRO = false` le désactive entièrement. */

export const SHOW_INTRO = true;
const SESSION_KEY = 'lts-intro-seen';
const HOLD_MS = 1100;
/* Logo qui s'efface (0,25 s), puis fond qui se dissout (0,8 s). */
const LIFT_MS = 1050;
const SETTLE_MS = 1800;

function shouldShow(): boolean {
  if (!SHOW_INTRO || typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return false;
  } catch {
    /* navigation privée : on joue le rideau sans le mémoriser */
  }
  const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'reload') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function IntroCurtain() {
  const [visible, setVisible] = useState(() => {
    const show = shouldShow();
    if (show) document.documentElement.classList.add('has-intro');
    return show;
  });
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* sans effet */
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopScroll();
    const lift = window.setTimeout(() => setLifting(true), HOLD_MS);
    const skip = () => setLifting(true);
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.clearTimeout(lift);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = previousOverflow;
      startScroll();
    };
  }, [visible]);

  /* À la levée : le défilement est rendu, et la classe `has-intro`
     n'est retirée qu'une fois l'entrée du hero terminée. */
  useEffect(() => {
    if (!lifting) return;
    document.body.style.overflow = '';
    startScroll();
    window.scrollTo(0, 0);
    const gone = window.setTimeout(() => setVisible(false), LIFT_MS);
    const settle = window.setTimeout(() => document.documentElement.classList.remove('has-intro'), LIFT_MS + SETTLE_MS);
    return () => {
      window.clearTimeout(gone);
      window.clearTimeout(settle);
    };
  }, [lifting]);

  useEffect(() => () => document.documentElement.classList.remove('has-intro'), []);

  if (!visible) return null;

  return (
    <div className={`intro-curtain intro-light ${lifting ? 'intro-curtain--lifting' : ''}`} aria-hidden="true" data-testid="intro-curtain">
      <img src="/logos/logo-horizontal-blanc.png" alt="" decoding="async" className="intro-light__logo" />
    </div>
  );
}
