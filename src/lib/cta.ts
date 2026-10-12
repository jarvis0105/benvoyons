import { cn } from '@/lib/utils';

/* Style commun à tous les appels à l'action du site : du texte en
   gras, jamais un bouton à fond plein ou à bordure — dans l'esprit
   léger et minimaliste recherché (peu de matière, du texte plutôt
   que des boîtes). Le survol se limite à un changement de couleur
   (`hover:text-brand` / `hover:text-brand-strong`) — le soulignement
   `.btn-underline` reste propre au bouton « Réserver » de la
   navigation (voir ReserveButton.tsx), pour rester un geste unique
   plutôt que répété par tous les liens du site. */
export function ctaClass(onDark = false, className?: string) {
  return cn(
    'inline-flex items-center gap-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300',
    onDark ? 'text-background hover:text-brand' : 'text-foreground hover:text-brand-strong',
    className,
  );
}
