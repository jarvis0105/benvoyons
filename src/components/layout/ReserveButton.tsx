import { useState } from 'react';

import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { openBooking } from '@/lib/booking';
import { cn } from '@/lib/utils';

interface ReserveButtonProps {
  onDarkHero?: boolean;
  className?: string;
}

/**
 * Bouton « Réserver » de l'en-tête : ouvre le module de réservation,
 * avec les disponibilités réelles du restaurant. Sobre, comme le
 * « Enquire » d'Omai : un mot, pas une boîte. */
export function ReserveButton({ onDarkHero = false, className }: ReserveButtonProps) {
  const { t } = useLang();
  const consent = useConsent();
  const [opening, setOpening] = useState(false);

  const handleClick = async () => {
    setOpening(true);
    try {
      await openBooking({}, consent.measurement);
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={opening}
      className={cn(
        /* Inspiré d'Omai (omaivillas.com) : un simple mot, sans cadre ni
           fond — capitales, semi-gras, légèrement espacé. Il pâlit au
           survol. La zone cliquable garde 44 px de haut. */
        'inline-flex h-11 cursor-pointer items-center justify-center whitespace-nowrap bg-transparent px-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-70 disabled:cursor-default disabled:opacity-60 md:text-[12px] md:tracking-[0.14em]',
        onDarkHero ? 'text-white' : 'text-foreground',
        className,
      )}
      data-testid="btn-nav-reserve"
    >
      <span>
        {opening ? t('Ouverture…') : t('Réserver')}
      </span>
    </button>
  );
}
