import type { ReactNode } from 'react';

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="reveal-fade space-y-3">
      <h2 className="font-serif text-xl md:text-2xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

/* Documents légaux : jusqu'ici la seule famille de pages du site
   sans le moindre effet de révélation au défilement — un aplat figé
   à côté de l'Accueil, des Menus ou des Avis, qui en jouent tous.
   Le label capitale + le décalage d'apparition (--reveal-delay)
   reprennent ici le même gabarit d'en-tête que le reste du site,
   sans rien changer au texte juridique lui-même. */
export function LegalPage({
  title,
  intro,
  eyebrow,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="pt-28 pb-10 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 text-center">
          {eyebrow && (
            <span
              className="reveal-fade block text-[11px] uppercase tracking-[0.4em] text-brand"
              style={{ ['--reveal-delay' as string]: '0ms' }}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className="reveal-fade mt-3 font-serif text-4xl md:text-5xl"
            style={{ ['--reveal-delay' as string]: '110ms' }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="reveal-fade font-serif italic text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed"
              style={{ ['--reveal-delay' as string]: '300ms' }}
            >
              {intro}
            </p>
          )}
        </div>
      </div>
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-2xl space-y-10">
          {children}
        </div>
      </div>
    </>
  );
}
