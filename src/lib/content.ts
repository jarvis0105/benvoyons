/* ────────────────────────────────────────────────────────────────
   Contenus partagés entre plusieurs pages.

   Avant ce fichier, la carte et les avis existaient en double : la
   page Menus avait sa liste complète, l'accueil une copie manuelle de
   trois d'entre eux ; idem pour les avis entre /avis et l'accueil. Un
   commentaire dans le code prévenait qu'il fallait « penser à
   modifier les deux » — c'est exactement le genre de consigne qu'on
   finit par oublier. Les horaires avaient déjà divergé de cette façon
   (19h00 d'un côté, 19h30 de l'autre).

   Prix et menus vérifiés sur laitthymsel.com/les-menus le 11/10/2026.

   Désormais, un prix ou un intitulé ne se modifie qu'ici, et les deux
   pages suivent. L'accueil ne choisit plus QUELS menus montrer en les
   recopiant, il les sélectionne par leur identifiant. */

export type Menu = {
  /** Identifiant stable, utilisé pour la sélection sur l'accueil. */
  id: string;
  name: string;
  etincelles: number;
  prix: string;
  service: 'Déjeuner' | 'Dîner';
  note: string | null;
  vegetarien: boolean;
};

export const MENUS: Menu[] = [
  {
    id: 'mise-en-lumiere',
    name: '« Mise en lumière »',
    etincelles: 3,
    prix: '49€',
    service: 'Déjeuner',
    note: "Service possible en 1 heure pour celles et ceux qui disposent d'un temps limité",
    vegetarien: false,
  },
  {
    id: 'chant-des-flammes',
    name: '« Le chant des flammes »',
    etincelles: 6,
    prix: '95€',
    service: 'Déjeuner',
    note: null,
    vegetarien: true,
  },
  {
    id: 'incandescence',
    name: '« Incandescence »',
    etincelles: 5,
    prix: '89€',
    service: 'Dîner',
    note: 'Servi du mardi au jeudi (hors vendredi et samedi)',
    vegetarien: false,
  },
  {
    id: 'crepitement',
    name: '« Crépitement des étoiles »',
    etincelles: 7,
    prix: '125€',
    service: 'Dîner',
    note: 'Servi du mardi au jeudi (hors vendredi et samedi)',
    vegetarien: true,
  },
  {
    id: 'danse-du-feu',
    name: '« La danse du feu »',
    etincelles: 9,
    prix: '155€',
    service: 'Dîner',
    note: null,
    vegetarien: false,
  },
  /* Le site d'origine propose aussi « La danse du feu » au déjeuner. */
  {
    id: 'danse-du-feu-dejeuner',
    name: '« La danse du feu »',
    etincelles: 9,
    prix: '155€',
    service: 'Déjeuner',
    note: null,
    vegetarien: false,
  },
];

export const DEJEUNERS = MENUS.filter((m) => m.service === 'Déjeuner');
export const DINERS = MENUS.filter((m) => m.service === 'Dîner');

/** Les trois menus mis en avant sur l'accueil : le plus accessible,
 *  puis les deux dîners qui encadrent la fourchette de prix. */
export const MENUS_APERCU = ['mise-en-lumiere', 'crepitement', 'danse-du-feu']
  .map((id) => MENUS.find((m) => m.id === id))
  .filter((m): m is Menu => Boolean(m));

/* ── Avis ─────────────────────────────────────────────────────────
   Avis Google, repris mot pour mot — aucun texte réécrit ni abrégé
   pour les besoins de la mise en page. */

export type Review = {
  text: string;
  stars: number;
  category: string;
  /** Mis en avant sur l'accueil. Trois suffisent, choisis pour couvrir
   *  trois registres distincts plutôt que trois fois le même éloge. */
  highlight?: boolean;
};

export const REVIEWS: Review[] = [
  {
    text: "Nous avons adoré ce lieu. Le concept de voir la préparation et la mise en place devant vous sur un îlot central est très sympa. Qualité des plats excellentes. Carte des vins très correcte surtout pour les vins de la région. À recommander.",
    stars: 5,
    category: 'Ambiance & Cuisine',
  },
  {
    text: "Excellente adresse. Les saveurs étaient au rendez-vous. Tout était parfait, de l'apéritif au dessert. Merci pour ce bon moment culinaire ! Je recommande vivement !",
    stars: 5,
    category: 'Expérience complète',
    highlight: true,
  },
  {
    text: "Nous avons passé une soirée exceptionnelle. Le restaurant est très intimiste, peu de tables et lumière tamisée ce qui donne une atmosphère très plaisante. Le service est impeccable et les serveurs très sympathiques. Enfin, la cuisine est vraiment de très grande qualité et plusieurs plats nous ont donné une grande émotion. Nous avons déjà hâte d'y retourner à une autre saison pour goûter de nouveau la cuisine des chefs. Merci !",
    stars: 5,
    category: 'Service & Émotion',
    highlight: true,
  },
  {
    text: 'Des saveurs et un régal continu. Nous avons eu grand plaisir à revenir.',
    stars: 5,
    category: 'Fidèle client',
  },
  {
    text: 'Excellent !',
    stars: 5,
    category: 'Avis Google',
  },
  {
    text: 'This restaurant surprised us in the best way. The food was absolutely delicious, creative. You can tell the chefs put their heart into the food they make. We visited a few Michelin awarded and recommended restaurants and this one was by far our favorite one. The experience and food felt at a 2 stars level.',
    stars: 5,
    category: 'International visitor',
    highlight: true,
  },
];

export const REVIEWS_APERCU = REVIEWS.filter((r) => r.highlight);
