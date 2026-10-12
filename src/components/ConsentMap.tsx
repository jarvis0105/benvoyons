import { MapPin } from 'lucide-react';

import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { writeConsent, readConsent } from '@/lib/consent';
import { ADDRESS_ONE_LINE, RESTAURANT } from '@/lib/restaurant';

const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `${RESTAURANT.name}, ${ADDRESS_ONE_LINE}`,
)}&output=embed`;

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${RESTAURANT.name}, ${ADDRESS_ONE_LINE}`,
)}`;

/**
 * La carte est un service extérieur : elle n'est chargée qu'avec
 * l'accord du visiteur. Tant qu'il n'a pas accepté, on affiche
 * l'adresse et un lien d'itinéraire — l'information reste
 * accessible, sans dépendance à un tiers.
 */
export function ConsentMap() {
  const { t } = useLang();
  const consent = useConsent();

  if (consent.maps) {
    return (
      <div className="aspect-video w-full border border-border" data-lenis-prevent>
        <iframe
          src={EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('Plan d’accès au restaurant Lait Thym Sel')}
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full border border-border bg-muted/30 flex flex-col items-center justify-center text-center gap-4 p-6">
      <MapPin className="w-6 h-6 text-brand-strong" />
      <div className="space-y-1">
        <p className="font-medium">{ADDRESS_ONE_LINE}</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t(
            'La carte interactive est fournie par un service extérieur. Elle ne se charge qu’avec votre accord.',
          )}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() =>
            writeConsent({
              measurement: readConsent()?.measurement ?? false,
              maps: true,
            })
          }
          className="px-5 py-2.5 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/85 transition-colors cursor-pointer"
          data-testid="btn-enable-map"
        >
          {t('Afficher la carte')}
        </button>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 border border-foreground/25 text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
          data-testid="link-directions"
        >
          {t('Itinéraire')}
        </a>
      </div>
    </div>
  );
}
