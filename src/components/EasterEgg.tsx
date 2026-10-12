import { useEffect, useState, useRef } from 'react';

/* ────────────────────────────────────────────────────────────────
   Easter egg — brief §24 : « extrêmement subtil… non intrusif… sans
   impact sur la navigation ni les performances ».

   Taper « lait thym sel » n'importe où sur le site (pas de champ à
   cliquer, pas de combinaison de touches à deviner dans un menu)
   révèle brièvement les trois motifs propriétaires de la maison —
   la courbe, la tige, le semis — avant de s'effacer d'elle-même.
   Un visiteur ordinaire ne tombera jamais dessus par accident ; ce
   n'est ni annoncé ni indiqué ailleurs sur le site.

   Coût, au repos : un seul écouteur `keydown` sur `window` et un
   tampon de quelques caractères — rien qui touche au rendu tant que
   la séquence n'est pas complète. */

const TARGET = 'laitthymsel';

export function EasterEgg() {
  const [visible, setVisible] = useState(false);
  const buffer = useRef('');
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore les frappes avec modificateur (raccourcis navigateur,
      // copier/coller…) pour ne jamais interférer avec eux.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Ignore aussi quand le focus est dans un champ de saisie —
      // taper une adresse ou un message ne doit jamais déclencher
      // quoi que ce soit d'inattendu.
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (/^[a-zA-Z]$/.test(e.key)) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(-TARGET.length);
        if (buffer.current === TARGET) {
          buffer.current = '';
          setVisible(true);
          if (hideTimer.current) clearTimeout(hideTimer.current);
          hideTimer.current = setTimeout(() => setVisible(false), 3200);
        }
      } else if (e.key !== ' ') {
        // Toute autre touche (Tab, flèches…) casse la séquence ;
        // l'espace est toléré pour qui tape « lait thym sel » avec
        // ses espaces naturels.
        buffer.current = '';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-700 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-foreground/85" />
      <div className="relative flex items-center gap-10 md:gap-16">
        {[
          { key: 'lait', label: 'Lait' },
          { key: 'thym', label: 'Thym' },
          { key: 'sel', label: 'Sel' },
        ].map((item, i) => (
          <div
            key={item.key}
            className="flex flex-col items-center gap-4 transition-all duration-700 ease-out"
            style={{
              transitionDelay: visible ? `${i * 140}ms` : '0ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            {/* Simple filet fin plutôt qu'une icône dessinée : cohérent
                avec le reste du système graphique, léger et sans
                fioriture. */}
            <span className="h-px w-8 bg-brand/60 md:w-10" aria-hidden="true" />
            <span className="font-serif text-2xl italic text-brand md:text-3xl">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
