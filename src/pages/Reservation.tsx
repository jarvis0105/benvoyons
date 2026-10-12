import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Info, Loader2, Phone } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { Kicker, Title } from '@/components/editorial';
import { SEO } from '@/components/SEO';
import { useConsent } from '@/components/CookieBanner';
import { useLang } from '@/i18n';
import { BOOKING_FALLBACK_URL, openBooking } from '@/lib/booking';
import { useDockedBookingWidget } from '@/lib/dockWidget';
import { ADDRESS_ONE_LINE, RESTAURANT, formatService, LUNCH, DINNER, LUNCH_DAYS } from '@/lib/restaurant';

export default function Reservation() {
  const { t, path } = useLang();
  const consent = useConsent();

  /* Emplacement réservé au module de réservation dans le flux de
     la page. Le module vient s'y superposer. */
  const slot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useDockedBookingWidget(slot, state === 'ready', 'fixed');

  useEffect(() => {
    let cancelled = false;
    // Le visiteur est venu sur la page « Réservation » : ouvrir le
    // module directement est ici le comportement attendu, pas une
    // fenêtre surgissante subie.
    openBooking({}, consent.measurement, { redirectOnFailure: false, position: 'left' })
      .then((opened) => {
        if (!cancelled) setState(opened ? 'ready' : 'failed');
      })
      .catch(() => {
        if (!cancelled) setState('failed');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <SEO
        title={t('Réservation — LAIT THYM SEL, Angers')}
        description={t(
          'Réservez votre table au restaurant LAIT THYM SEL à Angers. Disponibilités en temps réel ou réservation par téléphone.',
        )}
        canonicalPath="/reservation"
      />

      <div className="pt-32 pb-14 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Kicker align="center">{RESTAURANT.chefs} · Angers</Kicker>
          <Title as="h1" before={t('Réservez')} accent={t('votre table')} sub={t('Dîner dès 19h30, déjeuner mercredi et vendredi')} size="xl" align="center" />
          <p
            className="reveal-fade font-serif italic text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed"
            style={{ ["--reveal-delay" as string]: "320ms" }}
          >
            {t(
              'Nos disponibilités réelles, directement depuis notre livre de réservation.',
            )}
          </p>
        </div>
      </div>

      <div className="py-16 md:py-24 bg-muted/20 reveal-section">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.62fr)] gap-10 lg:gap-16 items-start">
            {/* Colonne du module. */}
            <div className="relative lg:sticky lg:top-28 lg:order-1 lg:self-start">
              <div className="mb-5 space-y-2">
                <span className="text-[11px] uppercase tracking-[0.3em] text-brand-ink">
                  {t('Disponibilités en temps réel')}
                </span>
                <p className="font-serif italic text-muted-foreground">
                  {t('Choisissez votre date, votre horaire et le nombre de convives.')}
                </p>
              </div>

              {/* AUCUNE ANIMATION sur ce bloc, ni sur ses parents : ni
                  révélation au défilement, ni transition, ni fondu.
                  L'iframe Zenchef est positionnée au pixel sur les
                  coordonnées de ce cadre (useDockedBookingWidget) : le
                  moindre élément qui bouge ou change d'opacité pendant
                  qu'elle s'installe la fait trembler. Le cadre est posé
                  une fois, définitivement. */}
              <div
                className="relative w-full max-w-[520px] mx-auto h-[660px] md:h-[720px] p-1 bg-background/80 shadow-[0_16px_45px_rgba(45,32,22,0.07)] overflow-hidden"
                data-testid="booking-slot"
                data-lenis-prevent
              >
              <div ref={slot} className="absolute inset-1" />
              {state !== 'ready' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-6 bg-background/80">
                  {state === 'loading' ? (
                    <>
                      <div className="booking-loader-mark">
                        <Loader2 className="w-5 h-5 text-brand-strong animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif text-xl">{t('Préparation de votre réservation')}</p>
                        <p className="text-sm text-muted-foreground">{t('Chargement des disponibilités…')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-xl">
                        {t('Le module ne s’est pas chargé')}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                        {t(
                          'Un bloqueur de publicité ou une connexion instable peut en être la cause. Vous pouvez réserver sur notre page dédiée, ou nous appeler.',
                        )}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={BOOKING_FALLBACK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="premium-button px-6 py-3 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium"
                          data-testid="link-booking-fallback"
                        >
                          {t('Ouvrir la page de réservation')}
                        </a>
                        <a
                          href={RESTAURANT.phoneHref}
                          className="premium-button px-6 py-3 border border-foreground/25 text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
                        >
                          {t('Nous appeler')}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* Colonne d'accompagnement, comme avant : elle porte le
                titre, l'intention et les horaires. Les horaires sont
                désormais lus depuis OPENING_HOURS (restaurant.ts) au
                lieu d'être saisis ici : cette page annonçait « Dîner :
                19h00 – 22h00 » quand la source du site dit 19h30 – 23h00,
                et le pied de page affichait donc autre chose. */}
            <aside className="lg:pt-14 space-y-6 lg:order-2 lg:border-l lg:border-brand/35 lg:pl-10">
              <span className="text-[11px] uppercase tracking-[0.35em] text-brand-ink">
                {RESTAURANT.chefs}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                {t('Réservez votre table')}
              </h2>
              <p className="font-serif italic text-lg text-muted-foreground leading-relaxed">
                {t('Nous vous accueillons du mardi au samedi, dans l’intimité de notre maison angevine.')}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('Choisissez votre date et votre horaire ci-contre. Les disponibilités sont mises à jour en temps réel par notre équipe.')}
              </p>
              <div className="pt-3 text-sm text-muted-foreground space-y-2">
                <p>
                  {t('Déjeuner')} ({LUNCH_DAYS.join(' ' + t('et') + ' ').toLowerCase()}) : {formatService(LUNCH)}
                </p>
                <p>
                  {t('Dîner')} : {formatService(DINNER)}
                </p>
              </div>
            </aside>
          </div>

          {/* Conditions : l'empreinte bancaire et la pénalité doivent
              être connues du client AVANT qu'il ne valide. Fond très
              légèrement teinté plutôt que le à-plat de brand/55
              précédent, trop soutenu pour un simple encart
              d'information — juste un filet à gauche pour le
              distinguer sans donner un ton d'alerte. */}
          <section
            className="reveal-fade bg-brand/[0.06] border-l-2 border-brand/50 p-7 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-brand-strong shrink-0" />
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-medium text-brand-ink">
                {t('Avant de réserver')}
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80 leading-relaxed">
              <li>
                {t(
                  'L’empreinte bancaire sert de garantie à votre réservation mais ne constitue aucun débit, ni acompte.',
                )}
              </li>
              <li>
                {t(
                  'Vous disposez d’un délai de 12h précédant l’horaire de votre réservation pour la modifier ou l’annuler.',
                )}
              </li>
              <li>
                {t(
                  'Passé ce délai, les demandes d’annulation seront traitées au cas par cas.',
                )}
              </li>
              <li>
                {t(
                  'Pour un groupe de plus de huit personnes ou une privatisation, appelez-nous : nous organiserons cela avec vous.',
                )}
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              <Link
                href={path('/cgu')}
                className="underline underline-offset-2 hover:text-foreground"
                data-testid="link-reservation-terms"
              >
                {t('Lire les conditions générales')}
              </Link>
            </p>
          </section>

          <div className="text-center border-t border-border/50 pt-10 space-y-2">
            <p className="text-muted-foreground text-sm">
              {t('Vous préférez réserver par téléphone ?')}
            </p>
            <a
              href={RESTAURANT.phoneHref}
              className="inline-flex items-center gap-2 text-foreground font-medium hover:text-brand-strong transition-colors text-base"
              data-testid="link-reserve-call"
            >
              <Phone className="w-4 h-4" />
              {RESTAURANT.phone}
            </a>
            <p className="text-xs text-muted-foreground">
              {t('Du mardi au samedi, à partir de 10h.')}
            </p>
            <p className="text-xs text-muted-foreground">{ADDRESS_ONE_LINE}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}