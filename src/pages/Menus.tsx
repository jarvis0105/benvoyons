import { SEO } from "@/components/SEO";
import { STOCK } from '@/lib/stock';
import { Layout } from "@/components/layout/Layout";
import { AlertCircle } from "lucide-react";
import { Kicker, Title, UnderlineLink, Etincelles, PageHero } from "@/components/editorial";

import { useLang } from "@/i18n";
import { DEJEUNERS as dejeuners, DINERS as diners } from "@/lib/content";


function MenuRow({ item, index, delay = 0 }: { item: (typeof dejeuners)[0]; index: number; delay?: number }) {
  const { t } = useLang();
  return (
    <li
      className="menu-row reveal-fade"
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      data-testid={`menu-card-${index}`}
    >
      <Etincelles count={item.etincelles} label={t(`Menu en ${item.etincelles} étincelles`)} />
      <span className="menu-row__name lts-menus__name">
        {t(item.name)}
        <span className="lts-menu-note">
          {t(item.etincelles > 1 ? `${item.etincelles} étincelles` : `${item.etincelles} étincelle`)}
          {item.vegetarien ? ` · ${t("Version végétarienne sur demande")}` : ''}
          {item.note ? ` · ${t(item.note)}` : ''}
        </span>
      </span>
      <span className="lts-menus__service">{t(item.service)}</span>
      <span className="lts-menus__prix">{item.prix}</span>
    </li>
  );
}

export default function Menus() {
  const { t, path } = useLang();
  return (
    <Layout>
      <SEO
        title={t("Nos Menus — LAIT THYM SEL | Restaurant gastronomique Angers")}
        description={t(
          "Découvrez nos menus déjeuners et dîners : Mise en lumière, Le chant des flammes, Incandescence, Crépitement des étoiles, La danse du feu. Restaurant gastronomique à Angers.",
        )}
      />

      <PageHero
        kicker={t("Fanny & Gaëtan Morvan · Angers")}
        before={t("De trois à neuf")}
        accent={t("étincelles")}
        sub={t("Un menu unique, servi à toute la table")}
        lead={t("Les menus prennent vie au fil des saisons, des producteurs de l’Anjou et de nos inspirations. Chaque assiette est découverte au moment où elle arrive.")}
      />

      {/* Image plein format : la sauce versée sur l'assiette, sur fond
          sombre — un geste plutôt qu'une pose, comme chez Khufu's. */}
      <div className="w-full h-[42vh] overflow-hidden">
        <img
          src={STOCK.saucePlat.src}
          srcSet={STOCK.saucePlat.srcSet}
          sizes="100vw"
          alt={t("Un chef verse la sauce sur une assiette dressée")}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[50%_53%]"
        />
      </div>

      {/* Déjeuners */}
      <section className="py-16 md:py-24 bg-background">
        <div className="lts-container max-w-5xl">
          <div className="mb-12">
            <Kicker number="01">{t("Service du midi")}</Kicker>
            <Title before={t("Le midi,")} accent={t("en lumière")} sub={t("Mercredi et vendredi")} />
          </div>

          <ul className="lts-menus">
            {dejeuners.map((item, i) => (
              <MenuRow key={i} item={item} index={i} delay={i * 130} />
            ))}
          </ul>
        </div>
      </section>

      {/* Diners */}
      <section className="py-16 md:py-24 lts-sand">
        <div className="lts-container max-w-5xl">
          <div className="mb-12">
            <Kicker number="02">{t("Service du soir")}</Kicker>
            <Title before={t("Le soir,")} accent={t("à l’aveugle")} sub={t("Du mardi au samedi, dès 19h30")} />
            <p className="lts-text reveal-fade mt-7 max-w-[560px]">
              {t("Notre format phare. Le soir, laissez-vous guider par notre menu Dégustation en 5 ou 7 temps. Une balade sensorielle à l'aveugle, construite autour des inspirations du moment.")}
              {" "}
              {t("Option végétarienne disponible")}.
            </p>
          </div>

          <ul className="lts-menus">
            {diners.map((item, i) => (
              <MenuRow key={i} item={item} index={100 + i} delay={i * 130} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── La Cave ────────────────────────────────────────────────
          Placée juste après les menus, et avant les mentions
          pratiques : c'est l'ordre dans lequel on compose un repas —
          on choisit d'abord ce qu'on mange, puis ce qu'on boit. Les
          allergies et le rappel « menu unique pour la table » ferment
          la page, comme des mentions de bas de carte.

          Le Vin et les Sans-Alcools partagent maintenant le même
          gabarit (photo d'un côté, texte de l'autre, filet + citation
          en pied de colonne) et alternent le côté de l'image, comme
          la section « La maison » sur la page d'accueil — deux
          boissons, un seul langage visuel, plutôt que deux traitements
          différents qui se suivaient sans se répondre. */}
      <section id="la-cave" className="bg-card reveal-section">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
            <img
              src={STOCK.cave.src}
              srcSet={STOCK.cave.srcSet}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt={t('Coupe garnie d\u2019une fleur, servie au bar de Lait Thym Sel')}
              loading="lazy"
              decoding="async"
              className="reveal-mask-left absolute inset-0 h-full w-full object-cover object-[center_38%]"
            />
          </div>

          <div className="flex items-center py-14 md:py-24">
            <div className="px-4 md:px-14 lg:px-20">
              <Kicker number="03">{t('La cave')}</Kicker>
              <Title before={t('Le')} accent={t('vin')} sub={t('450 références, beaucoup de Loire')} />

              <div
                className="reveal-fade mt-8 flex items-baseline gap-3 border-t border-brand/25 pt-6"
                style={{ ['--reveal-delay' as string]: '200ms' }}
              >
                <span className="font-serif text-5xl leading-none text-brand-strong-ink md:text-6xl">
                  450
                </span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-brand-ink">
                  {t('références')}
                </span>
              </div>

              <div className="mt-8 max-w-md space-y-5 text-muted-foreground">
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '120ms' }}
                >
                  {t('Avec plus de 450 références, notre cave reflète notre attachement aux terroirs français et aux vignerons que nous aimons. Une sélection cohérente, vivante, pensée pour accompagner notre cuisine avec justesse.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '220ms' }}
                >
                  {t('Nous proposons, sur chacun de nos menus, un accord Mets & Vins soigneusement réfléchi. Chaque verre est choisi pour prolonger le plat, sans excès, avec précision et équilibre.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '300ms' }}
                >
                  {t('Pour plus de liberté, une sélection de vins au verre complète la carte et permet de découvrir notre cave autrement.')}
                </p>
                <p
                  className="reveal-fade border-l border-brand/40 pl-6 font-serif text-xl italic leading-relaxed text-foreground"
                  style={{ ['--reveal-delay' as string]: '380ms' }}
                >
                  {t('Ici, le vin a un rôle simple : accompagner la cuisine avec justesse, discrétion et exigence.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les Sans-Alcools ───────────────────────────────────────
          Section à part entière, et non une note en bas de la
          précédente : ces accords sont signés, ils portent le travail
          personnel de Fanny. Les réduire à une ligne « sans alcool
          disponible » aurait effacé exactement ce qui les distingue.

          Même gabarit que Le Vin, ci-dessus, avec le côté de l'image
          inversé (photo à droite) : les deux sections se répondent
          visuellement au lieu de trancher entre une mise en page à
          deux colonnes et un bloc centré. Le texte est aligné à
          gauche — plus confortable à lire sur plusieurs phrases qu'un
          paragraphe centré, dont les retours à la ligne irréguliers
          fatiguent l'œil. L'icône verre rejoint la signature en haut
          de colonne plutôt que de flotter seule au-dessus du texte,
          et la photo de la création de Fanny sert désormais d'image
          de section (elle n'apparaît plus une seconde fois en pied de
          page). */}
      <section className="bg-background reveal-section">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          <div className="order-2 flex items-center py-14 md:order-1 md:py-24">
            {/* Même gabarit de marges que « Le Vin » ci-dessus
                (px-4 md:px-14 lg:px-20, symétrique) plutôt qu'un
                padding réduit côté image : les deux sections doivent
                se répondre exactement, y compris dans la largeur de
                respiration autour du texte — sinon le bloc de texte
                ne fait pas la même largeur d'une section à l'autre et
                la paire alternée perd sa cohérence. */}
            <div className="px-4 md:px-14 lg:px-20">
              <Kicker number="04">{t('Signés Fanny Morvan')}</Kicker>
              <Title before={t('Les')} accent={t('sans-alcools')} sub={t('Un verre pensé comme une sauce')} />

              {/* Filet + signature, en écho au bloc « 450 références »
                  de la section Le Vin ci-dessus : même gabarit (filet
                  supérieur, grand serif italique + légende capitale),
                  pour que les deux sections aient le même poids visuel
                  au lieu que l'une paraisse plus travaillée que
                  l'autre. Pas de chiffre ici — ces créations sont
                  faites à la main, pas cataloguées — donc une mention
                  qualitative plutôt qu'une quantité inventée. */}
              <div
                className="reveal-fade mt-8 flex items-baseline gap-3 border-t border-brand/25 pt-6"
                style={{ ['--reveal-delay' as string]: '200ms' }}
              >
                <span className="font-serif text-3xl italic leading-none text-brand-strong-ink md:text-4xl">
                  {t('Sur mesure')}
                </span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-brand-ink">
                  {t('créations maison')}
                </span>
              </div>

              <div className="mt-8 max-w-md space-y-5 text-muted-foreground">
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '120ms' }}
                >
                  {t('Les accords sans alcool sont le terrain de jeu de Fanny, entièrement imaginés et réalisés par elle. Chaque boisson est travaillée comme une véritable sauce, conçue pour prolonger le plat sans jamais en reproduire les saveurs.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '220ms' }}
                >
                  {t('L’objectif n’est pas d’imiter, mais d’accompagner avec justesse, en créant un lien naturel entre la cuisine et le verre — Fanny joue avec les textures, les acidités, les tempéraments des produits, toujours guidée par la saisonnalité.')}
                </p>
                <p
                  className="reveal-fade leading-relaxed"
                  style={{ ['--reveal-delay' as string]: '300ms' }}
                >
                  {t('À cela s’ajoute son amour pour la verrerie, qui devient un écrin à part entière : ces accords offrent une lecture différente du repas, précise, sensible et profondément réfléchie.')}
                </p>
                <p
                  className="reveal-fade border-l border-brand/40 pl-6 font-serif text-xl italic leading-relaxed text-foreground"
                  style={{ ['--reveal-delay' as string]: '380ms' }}
                >
                  {t('Une autre manière de vivre la table.')}
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 relative aspect-[4/3] overflow-hidden md:order-2 md:aspect-auto">
            <img
              src={STOCK.sansAlcool.src}
              srcSet={STOCK.sansAlcool.srcSet}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt={t('Une création sans alcool, garnie de pétales')}
              loading="lazy"
              decoding="async"
              className="reveal-mask absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Notes importantes */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="reveal-fade border border-border/60 bg-card p-8 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>{t("Ces menus sont servis pour l'ensemble de la table.")}</p>
                <p>
                  {t("Nous ne sommes cependant pas en mesure d'adapter notre menu totalement exempt de lactose, de gluten et d'œuf.")}
                </p>
                <p className="font-medium text-foreground">
                  {t("Il est essentiel de bien nous signaler toutes allergies ou régime particulier.")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p
              className="reveal-fade font-serif text-lg text-muted-foreground italic mb-8"
              style={{ ['--reveal-delay' as string]: '100ms' }}
            >
              {t("\"De belles surprises, tant dans la qualité du travail des produits que leur fraîcheur.")}<br className="hidden md:block" />
              {t("Laissez-vous surprendre par l'explosion des saveurs en bouche et le mariage des textures contrastées.\"")}
            </p>
            <UnderlineLink href={path("/reservation")} testId="link-menus-reserve">{t("Réserver votre table")}</UnderlineLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}