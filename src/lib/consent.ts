/* ────────────────────────────────────────────────────────────────
   Consentement.

   Le site ne charge par défaut aucun script tiers : pas de polices
   distantes, pas de carte, pas de mesure d'audience. Rien n'est
   déposé tant que le visiteur n'a pas choisi.

   Deux catégories seulement, pour rester lisible :
   - measurement : mesure d'audience (à brancher si besoin) et
     événements analytiques du module de réservation ;
   - maps : carte Google intégrée sur la page Contact.

   Le module de réservation lui-même n'attend pas de consentement :
   il n'est chargé que si le visiteur clique sur « Réserver », ce
   qui constitue une action explicite de sa part, et il est alors
   configuré sans traceur tant que « measurement » est refusé.
   ──────────────────────────────────────────────────────────────── */

export type Consent = {
  measurement: boolean;
  maps: boolean;
  /** Horodatage de la décision, pour pouvoir la faire réexpirer. */
  decidedAt: string;
};

const KEY = 'lts_consent_v1';
const EVENT = 'lts:consent-change';
/** Durée de validité de la décision : 6 mois, comme recommandé par la CNIL. */
const MAX_AGE_DAYS = 182;

export const NO_CONSENT: Consent = {
  measurement: false,
  maps: false,
  decidedAt: '',
};

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    const age =
      (Date.now() - new Date(parsed.decidedAt).getTime()) / 86_400_000;
    if (!Number.isFinite(age) || age > MAX_AGE_DAYS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: Omit<Consent, 'decidedAt'>): Consent {
  const consent: Consent = { ...choice, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    /* navigation privée : la décision ne vaudra que pour la session */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: consent }));
  return consent;
}

export function clearConsent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* rien à faire */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }));
}

export function onConsentChange(handler: () => void): () => void {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
