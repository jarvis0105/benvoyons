/* ────────────────────────────────────────────────────────────────
   Toutes les informations du restaurant, à un seul endroit.
   C'est le fichier à modifier pour changer un horaire, un numéro
   ou une adresse : rien de tout cela n'est écrit en dur ailleurs.
   ──────────────────────────────────────────────────────────────── */

export const SITE_URL = 'https://www.laitthymsel.fr';

export const RESTAURANT = {
  name: 'LAIT THYM SEL',
  chefs: 'Fanny & Gaëtan Morvan',
  phone: '+33 7 89 65 89 07',
  phoneHref: 'tel:+33789658907',
  email: 'contact@laitthymsel.fr',
  street: '17 Rue Boisnet',
  postalCode: '49100',
  city: 'Angers',
  country: 'FR',
  latitude: 47.4726,
  longitude: -0.5566,
  priceRange: '€€€€',
  cuisine: 'Française gastronomique',
  /** Ligne fixe historique, encore présente sur Facebook et les annuaires */
  landline: '02 41 72 08 64',
  landlineHref: 'tel:+33241720864',
  /** Identifiant du restaurant chez le prestataire de réservation */
  bookingId: '352208',
  instagramHandle: 'lait.thym.sel',
  instagramUrl: 'https://www.instagram.com/lait.thym.sel/?hl=fr',
  facebookUrl: 'https://www.facebook.com/Lait.Thym.Sel.Restaurant/?locale=fr_FR',
} as const;

/** Société exploitante — mentions légales obligatoires */
export const COMPANY = {
  legalName: 'FG2M Restaurant Lait Thym Sel',
  legalForm: 'SARL',
  capital: '10 000 €',
  rcsNumber: '830 927 380',
  rcsCity: 'Angers',
  /** Délai d'annulation sans frais, en heures */
  cancellationHours: 12,
  /** Pénalité de non-présentation, par couvert réservé */
  noShowPenalty: '500 €',
  paymentProvider: 'Payzen',
  bookingProvider: 'Zenchef',
} as const;

export const ADDRESS_ONE_LINE = `${RESTAURANT.street}, ${RESTAURANT.postalCode} ${RESTAURANT.city}`;

/* ── Horaires ──────────────────────────────────────────────────── */

export type Service = { opens: string; closes: string };

/* Deux services seulement, et pas tous les jours :
   le déjeuner n'est servi que le mercredi et le vendredi. */
export const LUNCH: Service = { opens: '12:00', closes: '14:00' };
export const DINNER: Service = { opens: '19:30', closes: '23:00' };

export const OPENING_HOURS: {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  services: Service[];
}[] = [
  { day: 'monday', services: [] },
  { day: 'tuesday', services: [DINNER] },
  { day: 'wednesday', services: [LUNCH, DINNER] },
  { day: 'thursday', services: [DINNER] },
  { day: 'friday', services: [LUNCH, DINNER] },
  { day: 'saturday', services: [DINNER] },
  { day: 'sunday', services: [] },
];

/** Jours de fermeture, en clé de traduction */
export const CLOSED_DAYS = ['sunday', 'monday'] as const;

export function isOpenNow(now = new Date()): boolean {
  const keys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const today = OPENING_HOURS.find((d) => d.day === keys[now.getDay()]);
  if (!today) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return today.services.some((s) => {
    const [oh, om] = s.opens.split(':').map(Number);
    const [ch, cm] = s.closes.split(':').map(Number);
    return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
  });
}


/* ── Affichage des horaires ────────────────────────────────────────
   Toutes les vues (pied de page, page Contact, page Réservation)
   passent par ici. Modifier OPENING_HOURS ci-dessus suffit à mettre
   le site entier à jour — les horaires ne sont plus réécrits à la
   main dans chaque composant.
   ──────────────────────────────────────────────────────────────── */

export const DAY_LABELS_FR: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export type HoursRow = { days: string; services: Service[] };

/** Semaine affichée à partir du mardi, pour que dimanche et lundi
 *  — les deux jours de fermeture — se regroupent naturellement. */
const DISPLAY_ORDER = [
  'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday',
] as const;

const sameServices = (a: Service[], b: Service[]) =>
  a.length === b.length &&
  a.every((s, i) => s.opens === b[i].opens && s.closes === b[i].closes);

/** Regroupe les jours consécutifs qui partagent les mêmes services. */
export function getGroupedHours(): HoursRow[] {
  const rows: HoursRow[] = [];
  let start: string | null = null;
  let end: string | null = null;
  let current: Service[] = [];

  const flush = () => {
    if (!start) return;
    const label =
      start === end
        ? DAY_LABELS_FR[start]
        : `${DAY_LABELS_FR[start]} – ${DAY_LABELS_FR[end as string]}`;
    rows.push({ days: label, services: current });
  };

  for (const day of DISPLAY_ORDER) {
    const services = OPENING_HOURS.find((d) => d.day === day)?.services ?? [];
    if (start && sameServices(services, current)) {
      end = day;
      continue;
    }
    flush();
    start = day;
    end = day;
    current = services;
  }
  flush();
  return rows;
}

/** « 12h00 – 14h00 » */
export const formatService = (s: Service) =>
  `${s.opens.replace(':', 'h')} – ${s.closes.replace(':', 'h')}`;

/** Les jours où un service de midi est proposé. */
export const LUNCH_DAYS = OPENING_HOURS
  .filter((d) => d.services.some((s) => s.opens === LUNCH.opens))
  .map((d) => DAY_LABELS_FR[d.day]);

/** Les jours où un service du soir est proposé. */
export const DINNER_DAYS = OPENING_HOURS
  .filter((d) => d.services.some((s) => s.opens === DINNER.opens))
  .map((d) => DAY_LABELS_FR[d.day]);

/** « mardi au samedi » si les jours se suivent, sinon « mardi, jeudi et samedi ».
 *  Évite d'écrire l'intervalle à la main : changer OPENING_HOURS suffit. */
function daysLabel(days: string[]): string {
  if (days.length === 0) return '';
  if (days.length === 1) return days[0].toLowerCase();
  const order = DISPLAY_ORDER.map((d) => DAY_LABELS_FR[d]);
  const idx = days.map((d) => order.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous) return `${days[0].toLowerCase()} au ${days[days.length - 1].toLowerCase()}`;
  const lower = days.map((d) => d.toLowerCase());
  return `${lower.slice(0, -1).join(', ')} et ${lower[lower.length - 1]}`;
}

export const LUNCH_DAYS_LABEL = daysLabel(LUNCH_DAYS);
export const DINNER_DAYS_LABEL = daysLabel(DINNER_DAYS);
