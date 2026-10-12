import { RESTAURANT } from './restaurant';

/* ────────────────────────────────────────────────────────────────
   Réservation.

   Le restaurant utilise Zenchef, qui est la source de vérité :
   c'est ce système qui connaît le plan de salle et les tables
   réellement disponibles. Le site ne tient donc aucun registre de
   réservations de son côté — il ouvre le module Zenchef.

   Le script officiel est chargé depuis sdk.zenchef.com, à la
   demande (au premier clic sur « Réserver »), et jamais avant.
   Trois conséquences : aucun script tiers sur les pages que le
   visiteur se contente de lire, aucun cookie déposé sans action de
   sa part, et une page d'accueil plus légère.

   Si le script est bloqué ou indisponible, on bascule sur la page
   de réservation hébergée par Zenchef : le visiteur peut toujours
   réserver.
   ──────────────────────────────────────────────────────────────── */

const SDK_URL = 'https://sdk.zenchef.com/v1/sdk.min.js';
const SDK_ID = 'zenchef-sdk';

export const BOOKING_FALLBACK_URL = `https://bookings.zenchef.com/results?rid=${RESTAURANT.bookingId}`;

type ZenchefApi = {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  isOpened?: () => boolean;
  openWith?: (params: { day?: string; pax?: number }) => void;
  on?: (event: string, handler: (e: CustomEvent) => void) => () => void;
};

declare global {
  interface Window {
    ZenchefWidget?: ZenchefApi;
  }
}

let loading: Promise<boolean> | null = null;

/* ────────────────────────────────────────────────────────────────
   État partagé « le module est-il ouvert ? ».

   Plusieurs boutons indépendants (hero, en-tête, pied de page, CTA de
   chaque page) déclenchent `openBooking()` chacun de leur côté. Pour
   habiller l'ouverture d'une modale unique (fond assombri, carte
   centrée, fermeture au clic extérieur — voir BookingModal.tsx), il
   faut un état commun que tous ces boutons alimentent sans se
   connaître entre eux. C'est un simple pub-sub : `notify()` est
   appelée dès qu'une ouverture aboutit ou qu'une fermeture est
   demandée, et n'importe quel composant peut s'y abonner.
   ──────────────────────────────────────────────────────────────── */
type StateListener = (open: boolean) => void;
const listeners = new Set<StateListener>();

function notify(open: boolean) {
  listeners.forEach((fn) => fn(open));
}

/** S'abonne à l'état ouvert/fermé du module. Retourne la fonction de désabonnement. */
export function onBookingStateChange(fn: StateListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

let sdkEventsWired = false;
/** Relaie les événements natifs du SDK (s'il en émet) vers notre pub-sub,
 *  pour rester synchronisé si le visiteur ferme le module autrement que
 *  par notre propre bouton de fermeture. Best-effort : silencieux si le
 *  SDK n'expose pas `on`. */
function wireSdkEvents() {
  if (sdkEventsWired) return;
  const api = window.ZenchefWidget;
  if (!api?.on) return;
  sdkEventsWired = true;
  try {
    api.on('open', () => notify(true));
    api.on('close', () => notify(false));
  } catch {
    // Le SDK ne supporte pas ces événements : notify() reste piloté
    // uniquement par openBooking()/closeBooking() ci-dessous.
  }
}

/** Injecte le bloc de configuration attendu par le SDK. */
type WidgetPosition = 'left' | 'right';

function ensureConfigElement(analyticsAllowed: boolean, position: WidgetPosition) {
  const existing = document.querySelector<HTMLElement>('.zc-widget-config');
  const config = existing ?? document.createElement('div');

  if (!existing) {
    config.className = 'zc-widget-config';
  }

  config.setAttribute('data-restaurant', RESTAURANT.bookingId);
  config.setAttribute('data-lang', document.documentElement.lang || 'fr');
  config.setAttribute('data-position', position);
  // Attention au piège : dans le SDK, l'attribut est lu par sa
  // PRÉSENCE, pas par sa valeur. Absent → le module est affiché en
  // permanence sous forme de barre repliée. Présent, quelle que
  // soit la valeur (« true » comme « false ») → le module reste
  // caché jusqu'à un appel explicite à open().
  // C'est exactement ce que l'ancien site déclarait, ce qui
  // masquait le bouton sans jamais fournir de déclencheur : le
  // module était donc inatteignable. Ici on l'assume, parce que le
  // site fournit ses propres boutons « Réserver ».
  config.setAttribute('data-hide-default-button', '');
  if (!analyticsAllowed) {
    config.setAttribute('data-disable-gtm', 'true');
    config.setAttribute('data-disable-ga4', 'true');
    config.setAttribute('data-send-page-views', 'false');
  }
  if (!existing) {
    document.body.appendChild(config);
  }
}

export function isBookingWidgetOpen(): boolean {
  return Boolean(window.ZenchefWidget?.isOpened?.());
}

export function closeBooking(): void {
  window.ZenchefWidget?.close?.();
  notify(false);
}

export function loadBookingWidget(
  analyticsAllowed = false,
  position: WidgetPosition = 'right',
): Promise<boolean> {
  ensureConfigElement(analyticsAllowed, position);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    if (document.getElementById(SDK_ID)) {
      wireSdkEvents();
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = SDK_ID;
    script.async = true;
    script.src = SDK_URL;
    script.onload = () => {
      wireSdkEvents();
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);

    // Filet de sécurité : si le script n'a pas répondu en 6 s
    // (réseau lent, bloqueur de publicité), on n'attend pas plus.
    window.setTimeout(() => resolve(Boolean(window.ZenchefWidget)), 6000);
  });

  return loading;
}

export type BookingIntent = {
  /** Date au format YYYY-MM-DD */
  day?: string;
  /** Nombre de couverts */
  pax?: number;
};

/**
 * Ouvre le module de réservation. Retombe sur la page hébergée par
 * Zenchef si le SDK n'est pas disponible.
 */
export async function openBooking(
  intent: BookingIntent = {},
  analyticsAllowed = false,
  options: { redirectOnFailure?: boolean; position?: WidgetPosition } = {},
): Promise<boolean> {
  const { redirectOnFailure = true, position = 'right' } = options;
  const ready = await loadBookingWidget(analyticsAllowed, position);

  if (ready) {
    // Le SDK peut mettre un instant à exposer son API après le load.
    for (let i = 0; i < 25; i++) {
      const api = window.ZenchefWidget;
      if (api?.openWith && (intent.day || intent.pax)) {
        api.openWith(intent);
        notify(true);
        return true;
      }
      if (api?.open) {
        api.open();
        notify(true);
        return true;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  if (!redirectOnFailure) return false;

  const params = new URLSearchParams();
  if (intent.day) params.set('day', intent.day);
  if (intent.pax) params.set('pax', String(intent.pax));
  const query = params.toString();
  window.location.href = query
    ? `${BOOKING_FALLBACK_URL}&${query}`
    : BOOKING_FALLBACK_URL;
  return false;
}
