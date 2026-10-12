/* ────────────────────────────────────────────────────────────────
   Photos et producteurs de la maison, repris du site d'origine
   (laitthymsel.com).

   Photos : Laura Evrat (crédit indiqué sur la page « Remerciements »
   du site d'origine, et en pied de page ici). Elles sont la propriété
   du restaurant : à ne réutiliser qu'avec son accord.

   La plupart des fichiers d'origine font 600 × 900 px : ils sont
   utilisés en cartes et en panneaux, jamais en plein écran. Seuls le
   portrait des chefs et le dressage existent en haute définition. */

export type MaisonPhoto = { src: string; srcSet: string; width: number; height: number };

function photo(name: string, width: number, height: number, variants: number[]): MaisonPhoto {
  const base = `/photos/maison/${name}`;
  const set = variants.map((w) => `${base}-${w}.webp ${w}w`);
  set.push(`${base}.webp ${width}w`);
  return { src: `${base}.webp`, srcSet: set.join(', '), width, height };
}

export const MAISON = {
  chefs: photo('chefs-fanny-gaetan', 1707, 2560, [480, 960]),
  dressage: photo('gaetan-dressage', 1691, 2560, [480, 960]),
  facade: photo('facade-brique', 600, 900, [480]),
  facade2: photo('facade-brique-2', 600, 900, [480]),
  entree: photo('entree', 600, 900, [480]),
  mainsBranches: photo('mains-branches', 600, 900, [480]),
  mainsFleurs: photo('mains-fleurs', 600, 900, [480]),
  terre: photo('terre', 600, 900, [480]),
  salle: photo('salle', 600, 900, [480]),
  marbre: photo('marbre-flamme', 600, 900, [480]),
  table: photo('table', 600, 900, [480]),
  cartesMenus: photo('cartes-menus', 600, 900, [480]),
  fleur: photo('fleur', 740, 518, [480]),
} satisfies Record<string, MaisonPhoto>;

/* ── Photos de la maison déjà présentes dans le projet ──────────────
   (public/photos) : salle, assiettes, bar, équipe. Plus grandes et plus
   « table étoilée » que les ambiances du site d'origine : ce sont elles
   qui portent les sections principales.

   Règle : chaque photo n'apparaît qu'une fois sur tout le site. Attention
   aux scènes en double sous deux noms : `salle-soir` = `chefs/ambiance2`,
   `hero-bar-comptoir` = `restaurant` = `bar` (le bar est réservé au
   diaporama de l'accueil), `chefs/fanny-gaetan` = `MAISON.chefs`. */
function local(name: string, width: number, height: number, variants: number[]): MaisonPhoto {
  const base = `/photos/${name}`;
  const set = variants.map((w) => `${base}-${w}.webp ${w}w`);
  set.push(`${base}.webp ${width}w`);
  return { src: `${base}.webp`, srcSet: set.join(', '), width, height };
}

export const LUXE = {
  salleSoir: local('salle-soir', 1600, 2400, [480, 960]),
  barComptoir: local('hero-bar-comptoir', 2000, 1090, [480, 960, 1440]),
  stJacques: local('st-jacques', 1026, 1280, [480, 960]),
  platSauce: local('plat-sauce', 1500, 1500, [480, 960]),
  platHuitre: local('plat-huitre', 900, 1123, [480]),
  mangue: local('mangue', 1400, 932, [480, 960]),
  cuisineVerriere: local('cuisine-verriere', 2000, 1500, [480, 960, 1440]),
  chefsEnCuisine: local('fanny-gaetan-cuisine', 1260, 708, [480, 960]),
  equipe: local('equipe', 1260, 708, [480, 960]),
  cocktailFleur: local('cocktail-fleur', 1920, 1920, [480, 960]),
  cocktailPetales: local('cocktail-petales', 1100, 1100, [480, 960]),
  bolPied: local('bol-pied', 1200, 1500, [480, 960]),
  dessertPoire: local('dessert-poire', 1176, 783, [480]),
  /* N'existe qu'en 480 et 960 px. */
  platDessert: {
    src: '/photos/plat-dessert-960.webp',
    srcSet: '/photos/plat-dessert-480.webp 480w, /photos/plat-dessert-960.webp 960w',
    width: 960,
    height: 960,
  },
  /* Portraits individuels, en noir et blanc. */
  fanny: { src: '/chefs/fanny.webp', srcSet: '/chefs/fanny-480.webp 480w, /chefs/fanny.webp 750w', width: 750, height: 1125 },
  gaetan: { src: '/chefs/gaetan.webp', srcSet: '/chefs/gaetan-480.webp 480w, /chefs/gaetan.webp 750w', width: 750, height: 1125 },
  salleVitrail: local('salle-vitrail', 1600, 1067, [480, 960]),
} satisfies Record<string, MaisonPhoto>;

export const PHOTO_CREDIT = 'Laura Evrat';

/* ── Producteurs ───────────────────────────────────────────────────
   Repris mot pour mot de la page « Remerciements » du site d'origine
   (« À tous nos producteurs qui nous suivent depuis le début »).
   `lieu` : la commune quand elle est citée, et toujours le
   département entre parenthèses, comme sur le site d'origine. */
export type Producteur = { nom: string; detail?: string; lieu: string };

export const PRODUCTEURS: Producteur[] = [
  { nom: 'Un cheval, un champ', lieu: 'Le Puy-Notre-Dame (49)' },
  { nom: 'L’Angevine', detail: 'Frédérique Poupard', lieu: '(49)' },
  { nom: 'La Ferme marine', lieu: '(44)' },
  { nom: 'Le Jardin d’Eva', lieu: 'Valanjou (49)' },
  { nom: 'La ferme Belle Miss’Terre', lieu: '(49)' },
  { nom: 'Dylan Grobois', detail: 'pêcheur professionnel de Loire', lieu: 'Montjean (49)' },
  { nom: 'Maison Petrossian', detail: 'Maxence', lieu: '(49)' },
  { nom: 'Nishikidori', lieu: '(44)' },
  { nom: 'Chemain Faisant', lieu: '(01)' },
  { nom: 'JA Gastronomie', lieu: 'Angers (49)' },
  { nom: 'Capmarée', detail: 'Frédérique', lieu: 'Nantes (44)' },
  { nom: 'Fromagerie Paccard', lieu: 'Manigod (74)' },
  { nom: 'Des Halles et des Gourmets', detail: 'Patrick Rigourd', lieu: '(49)' },
  { nom: 'L’Hôte de Vie', detail: 'Estienne, vin d’homme', lieu: '(49)' },
  { nom: 'Les Caves du Château', lieu: 'Faverges (74)' },
];

/** Boutique de chèques et coffrets cadeaux (lien du site d'origine). */
export const GIFT_SHOP_URL = 'https://laitthymsel.secretbox.fr';
