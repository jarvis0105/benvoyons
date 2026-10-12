import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useLang } from '@/i18n';
import { ctaClass } from '@/lib/cta';

/* Page 404 : jusqu'ici la seule du site à ne pas passer par <Layout />
   (donc sans en-tête ni pied de page) et à utiliser des gris Tailwind
   par défaut au lieu des tokens de la charte — un décrochage brutal
   pour un visiteur qui tombe dessus depuis un lien mort. Reprend ici
   le même gabarit que les en-têtes de page (Menus, Avis, Contact…) :
   label capitale, titre serif, filet, texte d'accompagnement, puis un
   bouton de retour. */
export default function NotFound() {
  const { t, path } = useLang();

  return (
    <Layout>
      <SEO
        title={t('Page introuvable — LAIT THYM SEL')}
        description={t("La page demandée n'existe pas ou plus.")}
      />

      <section className="flex min-h-[70svh] items-center justify-center bg-background px-6 py-32 text-center">
        <div className="reveal-fade mx-auto max-w-md">
          <span
            className="block text-[11px] uppercase tracking-[0.4em] text-brand"
            style={{ ['--reveal-delay' as string]: '0ms' }}
          >
            {t('Erreur 404')}
          </span>

          <h1
            className="mt-4 font-serif text-4xl text-foreground md:text-5xl"
            style={{ ['--reveal-delay' as string]: '110ms' }}
          >
            {t('Cette page nous a échappé')}
          </h1>

          <p
            className="reveal-fade mt-6 font-serif italic leading-relaxed text-muted-foreground"
            style={{ ['--reveal-delay' as string]: '300ms' }}
          >
            {t(
              "Le lien que vous avez suivi est introuvable — la page a peut-être changé d'adresse ou n'existe plus.",
            )}
          </p>

          <div
            className="reveal-fade mt-10"
            style={{ ['--reveal-delay' as string]: '380ms' }}
          >
            <Link
              href={path('/')}
              className={ctaClass(false)}
              data-testid="link-404-home"
            >
              {t("Retour à l'accueil")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
