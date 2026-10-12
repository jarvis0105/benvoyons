import { useEffect, useRef, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   Ornements de la maison : les trois mots du nom, dessinés au trait.

   Comme les illustrations de The Largo ou la fleur au trait de
   Khufu's, ils donnent au site une écriture qui n'appartient qu'à lui :
   LAIT, une goutte ; THYM, un brin ; SEL, des cristaux. Trait cuivré,
   fin, un peu irrégulier, qui se dessine quand l'ornement arrive à
   l'écran (une seule fois). Purement décoratifs : `aria-hidden`.

   <Ornament kind="trio" />  — les trois, séparés de points : séparateur
   <Ornament kind="thym" />  — le brin seul (menu, pied de page)        */

type Kind = 'trio' | 'lait' | 'thym' | 'sel';

function Lait() {
  return (
    <svg viewBox="0 0 40 56" className="lts-orn__svg lts-orn__svg--lait">
      <path pathLength={1} d="M20 3 C 19 10, 6 26, 6 37 C 6 46, 12.5 52, 20 52 C 27.5 52, 34 46, 34 37 C 34 26, 21 10, 20 3 Z" />
      <path pathLength={1} d="M12.5 39 C 13 44, 16 47, 20 47.5" />
    </svg>
  );
}

/* Brin de thym : une tige souple, des paires de petites feuilles
   ovales qui raccourcissent vers l'extrémité. */
const LEAVES: [number, number, number, number][] = [
  // x, y, rotation, longueur
  [34, 37, -58, 9], [42, 41, 34, 8.5],
  [62, 31, -54, 8.5], [70, 35, 38, 8],
  [90, 25, -50, 8], [98, 29, 40, 7.5],
  [118, 19.5, -46, 7], [125, 23, 42, 6.5],
  [143, 14.5, -42, 6], [149, 18, 44, 5.5],
  [164, 11, -36, 4.5], [168, 13.5, 46, 4],
];
function Thym() {
  return (
    <svg viewBox="0 0 190 52" className="lts-orn__svg lts-orn__svg--thym">
      <path pathLength={1} d="M6 46 C 40 40, 70 33, 100 25 C 130 17, 155 11, 182 8" />
      <path pathLength={1} d="M52 36 C 50 30, 47 27, 41 25" />
      {LEAVES.map(([x, y, r, l], i) => (
        <ellipse key={i} pathLength={1} cx={x} cy={y} rx={l * 0.75} ry={l * 0.26} transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </svg>
  );
}

/* Cristaux de sel : trois petits cubes en perspective. */
function cube(x: number, y: number, s: number) {
  const h = s * 0.5;
  return `M${x} ${y} l${s} ${-h} l${s} ${h} l${-s} ${h} Z M${x} ${y} v${s} l${s} ${h} v${-s} M${x + 2 * s} ${y} v${s} l${-s} ${h}`;
}
function Sel() {
  return (
    <svg viewBox="0 0 64 50" className="lts-orn__svg lts-orn__svg--sel">
      <path pathLength={1} d={cube(6, 22, 11)} />
      <path pathLength={1} d={cube(32, 12, 8)} />
      <path pathLength={1} d={cube(38, 34, 5.5)} />
    </svg>
  );
}

export function Ornament({ kind = 'trio', className = '', tone = 'copper' }: { kind?: Kind; className?: string; tone?: 'copper' | 'light' }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className={`lts-orn lts-orn--${kind} lts-orn--${tone} ${drawn ? 'is-drawn' : ''} ${className}`}>
      {kind === 'trio' ? (
        <>
          <Lait />
          <i className="lts-orn__dot" />
          <Thym />
          <i className="lts-orn__dot" />
          <Sel />
        </>
      ) : kind === 'lait' ? <Lait /> : kind === 'thym' ? <Thym /> : <Sel />}
    </span>
  );
}
