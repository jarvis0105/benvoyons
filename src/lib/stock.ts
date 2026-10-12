import type { MaisonPhoto } from '@/lib/maison';

/* ────────────────────────────────────────────────────────────────
   Photos Unsplash (licence Unsplash : usage libre, attribution non
   obligatoire). Choisies en haute définition, dans l'esprit des sites
   de référence (Khufu's, The Largo) : lumière chaude, cadrage serré et
   en situation, des gestes plutôt que des poses.

   Ce ne sont pas des photos de la maison : leurs textes alternatifs
   décrivent ce qu'elles montrent, sans prétendre le contraire. À
   remplacer par une séance photo dédiée (voir le brief du README).

   Règle : chaque photo n'apparaît qu'une seule fois sur tout le site
   (exception : le château, voir `chateau`). */

const WIDTHS = [800, 1200, 1600, 2000, 2400];

function stock(id: string, width: number, height: number): MaisonPhoto {
  const url = (w: number) => `https://images.unsplash.com/${id}?fm=jpg&q=85&w=${w}&auto=format&fit=crop&ixlib=rb-4.1.0`;
  return {
    src: url(2000),
    srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(', '),
    width,
    height,
  };
}

export const STOCK = {
  /* Accueil — les trois temps (choix d'origine) */
  salleVitrail: stock('photo-1722322500360-ca7c03467498', 6000, 4000),
  assiette: stock('photo-1600663791817-d74f5196ba29', 3600, 4500),
  cuisine: stock('photo-1760169799369-2b8574466735', 6000, 4000),
  /* Accueil — immersion plein écran (choix d'origine). Également dans le
     diaporama du haut de l'accueil : seul doublon, voulu par le client. */
  chateau: stock('photo-1660401023330-318f599edfa2', 6000, 4000),
  /* Accueil — la soirée */
  bougie: stock('photo-1773188243397-29591fa09047', 4000, 6000),
  vin: stock('photo-1712645376049-a8d414d4a364', 4377, 5471),
  lampe: stock('photo-1762806883627-4bcbfad98a2c', 4160, 6240),
  /* Accueil — producteurs et cadeaux */
  producteur: stock('photo-1751210769268-85d43ecfcdd8', 3840, 5760),
  fleursSechees: stock('photo-1756807123633-2d266bfb51d6', 6000, 4000),
  /* À propos */
  aboutHero: stock('photo-1676471932681-45fa972d848a', 3354, 3354),
  brigade: stock('photo-1661505300192-f2eef03a3876', 4000, 6000),
  lumiere: stock('photo-1669503361234-589ecef5ec6d', 4000, 6000),
  salle: stock('photo-1782714074903-1c5bfa8f3497', 2883, 5126),
  /* À propos — galerie (même composition que la galerie d'origine) */
  dressagePince: stock('photo-1775513153018-0c7ac7899751', 2784, 4176),
  assietteOmbre: stock('photo-1697536841089-ef40d6c18ee1', 4160, 6240),
  tableDressee: stock('photo-1488324346298-5ad3d8f96d0d', 2458, 3213),
  potier: stock('photo-1607556671927-78a6605e290b', 4242, 2828),
  assietteMinimale: stock('photo-1616669989627-0cea7f32be2c', 5235, 3926),
  /* Menus */
  saucePlat: stock('photo-1663530761401-15eefb544889', 4148, 4148),
  cave: stock('photo-1748674754202-0c3c3413c8c3', 3000, 4500),
  sansAlcool: stock('photo-1570598912132-0ba1dc952b7d', 3000, 4000),
  /* Contact (choix d'origine) */
  huitres: stock('photo-1562009956-c5093f408a88', 5472, 3648),
} satisfies Record<string, MaisonPhoto>;
