import type { ReactNode } from 'react';
import { Link } from 'wouter';

/* ────────────────────────────────────────────────────────────────
   Briques éditoriales partagées par toutes les pages.

   Une seule voix pour les titres : Bodoni Moda en capitales, graisse
   normale, un mot en italique gras. Un sous-titre italique décalé,
   comme une annotation à la main. Une étiquette en petites capitales
   précédée d'un numéro en filigrane. Des liens soulignés d'un filet.
   Les styles vivent dans `src/home-editorial.css` (préfixe `.lts-`). */

export function Kicker({
  number, children, align = 'left',
}: { number?: string; children: ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={`lts-kicker-wrap lts-kicker-wrap--${align}${number ? '' : ' lts-kicker-wrap--bare'}`}>
      {number ? <span className="lts-number" aria-hidden="true" data-n={number} /> : null}
      <span className="lts-kicker">{children}</span>
    </div>
  );
}

/* Titre révélé ligne par ligne (classe `.lift` du site : le texte
   monte depuis un cache quand il entre dans le champ). `accent` est
   le mot, ou le groupe de mots, en italique gras. */
export function Title({
  before, accent, after, sub, size = 'md', align = 'left', as: Tag = 'h2', light = false,
}: {
  before?: string; accent?: string; after?: string; sub?: string;
  size?: 'md' | 'lg' | 'xl'; align?: 'left' | 'center'; as?: 'h1' | 'h2' | 'h3'; light?: boolean;
}) {
  return (
    <div className={`lts-title-wrap lts-title-wrap--${align}`}>
      <div className="lift">
        <Tag className={`lts-title lts-title--${size}${light ? ' lts-title--inherit' : ''}`}>
          {before}{before ? ' ' : ''}
          {accent ? <em>{accent}</em> : null}
          {after ? ' ' : ''}{after}
        </Tag>
      </div>
      {sub ? <span className={`lts-script reveal-fade${light ? ' lts-script--light' : ''}`}>{sub}</span> : null}
    </div>
  );
}

export function UnderlineLink({
  href, children, onDark = false, external = false, testId, className = '',
}: { href: string; children: ReactNode; onDark?: boolean; external?: boolean; testId?: string; className?: string }) {
  const cls = `lts-underline ${onDark ? 'lts-underline--light' : ''} ${className}`;
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-testid={testId}>{children}</a>;
  }
  return <Link href={href} className={cls} data-testid={testId}>{children}</Link>;
}

/* En-tête des pages intérieures : étiquette, grand titre, annotation,
   et un chapô facultatif. Fond clair, centré, aéré. */
export function PageHero({
  kicker, before, accent, after, sub, lead, children,
}: { kicker: string; before?: string; accent?: string; after?: string; sub?: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="lts-page-hero">
      <div className="lts-container">
        <Kicker align="center">{kicker}</Kicker>
        <Title as="h1" before={before} accent={accent} after={after} sub={sub} size="xl" align="center" />
        {lead ? <p className="lts-lead reveal-fade mx-auto mt-7 max-w-2xl text-center">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

/* Étincelles d'un menu : les allumées, puis les éteintes jusqu'à neuf. */
export function Etincelles({ count, max = 9, label }: { count: number; max?: number; label?: string }) {
  return (
    <span className="lts-sparks" role="img" aria-label={label ?? `${count} / ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`lts-spark${i < count ? '' : ' lts-spark--dim'}`} style={{ ['--i' as string]: i }} aria-hidden="true">
          <path d="M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z" />
        </svg>
      ))}
    </span>
  );
}

/* « Une cuisine *ouverte*. » : le passage entre astérisques passe en
   italique. Permet de traduire une phrase entière quand l'ordre des mots
   change d'une langue à l'autre (« An *open kitchen*. »). */
export function withAccent(text: string): ReactNode[] {
  return text
    .split(/(\*[^*]+\*)/)
    .map((part, i) => (part.length > 2 && part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part));
}
