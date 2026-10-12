import { useCallback, useEffect, useId, useState } from 'react';
import { Link } from 'wouter';

import {
  NO_CONSENT,
  onConsentChange,
  readConsent,
  writeConsent,
  type Consent,
} from '@/lib/consent';
import { useLang } from '@/i18n';

/** État du consentement, réactif dans toute l'application. */
export function useConsent(): Consent {
  const [consent, setConsent] = useState<Consent>(
    () => readConsent() ?? NO_CONSENT,
  );
  useEffect(
    () => onConsentChange(() => setConsent(readConsent() ?? NO_CONSENT)),
    [],
  );
  return consent;
}

/* ────────────────────────────────────────────────────────────────
   Bandeau cookies.

   Une carte posée en bas à gauche (en bas de l'écran sur mobile),
   dans la palette de la maison : l'emblème, un titre en Bodoni, une
   phrase, et trois actions. « Accepter » et « Refuser » ont la même
   taille et le même poids visuel — refuser doit être aussi simple
   qu'accepter (recommandation CNIL). « Personnaliser » déplie les
   deux réglages réels du site : mesure d'audience et carte Contact.

   La carte apparaît après le rideau d'ouverture, pour ne pas
   recouvrir le premier regard sur la page. Elle ne bloque rien :
   on peut naviguer sans répondre. */

const DELAY_AFTER_INTRO_MS = 2600;
const DELAY_DEFAULT_MS = 700;

function Toggle({ id, checked, onChange, label, hint }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label htmlFor={id} className="lts-cookie__row">
      <span className="lts-cookie__row-text">
        <strong>{label}</strong>
        <span>{hint}</span>
      </span>
      <input id={id} type="checkbox" role="switch" className="lts-cookie__switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function CookieBanner() {
  const { t, path } = useLang();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const [custom, setCustom] = useState(false);
  const [measurement, setMeasurement] = useState(false);
  const [maps, setMaps] = useState(false);
  const titleId = useId();
  const idM = useId();
  const idMaps = useId();

  useEffect(() => {
    let timer = 0;
    if (!readConsent()) {
      const delay = document.documentElement.classList.contains('has-intro') ? DELAY_AFTER_INTRO_MS : DELAY_DEFAULT_MS;
      setVisible(true);
      timer = window.setTimeout(() => setShown(true), delay);
    }
    const off = onConsentChange(() => {
      const open = !readConsent();
      setVisible(open);
      setShown(open);
    });
    return () => {
      window.clearTimeout(timer);
      off();
    };
  }, []);

  const decide = useCallback((choice: { measurement: boolean; maps: boolean }) => {
    setShown(false);
    window.setTimeout(() => {
      writeConsent(choice);
      setVisible(false);
    }, 380);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`lts-cookie ${shown ? 'is-shown' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <div className="lts-cookie__head">
        <img src="/logos/logo-emblem-mark.png" alt="" width={34} height={34} className="lts-cookie__emblem" />
        <p id={titleId} className="lts-cookie__title">{t('Quelques cookies,')} <em>{t('rien de plus')}</em></p>
      </div>
      <p className="lts-cookie__text">
        {t('Nous mesurons la fréquentation du site et affichons la carte de la page Contact seulement avec votre accord.')}{' '}
        <Link href={path('/rgpd')} className="lts-cookie__link">{t('En savoir plus')}</Link>
      </p>

      <div className={`lts-cookie__custom ${custom ? 'is-open' : ''}`} aria-hidden={!custom}>
        <div className="lts-cookie__custom-inner">
          <Toggle id={idM} checked={measurement} onChange={setMeasurement} label={t('Mesure d’audience')} hint={t('Statistiques de visite anonymes')} />
          <Toggle id={idMaps} checked={maps} onChange={setMaps} label={t('Carte de la page Contact')} hint={t('Plan Google Maps intégré')} />
        </div>
      </div>

      <div className="lts-cookie__actions">
        {custom ? (
          <button type="button" className="lts-cookie__btn lts-cookie__btn--fill" onClick={() => decide({ measurement, maps })} data-testid="btn-consent-save">
            {t('Enregistrer mes choix')}
          </button>
        ) : (
          <>
            <button type="button" className="lts-cookie__btn lts-cookie__btn--fill" onClick={() => decide({ measurement: true, maps: true })} data-testid="btn-consent-accept">
              {t('Accepter')}
            </button>
            <button type="button" className="lts-cookie__btn" onClick={() => decide({ measurement: false, maps: false })} data-testid="btn-consent-refuse">
              {t('Refuser')}
            </button>
          </>
        )}
      </div>
      <button type="button" className="lts-cookie__more" onClick={() => setCustom((c) => !c)} aria-expanded={custom}>
        {custom ? t('Revenir') : t('Personnaliser')}
      </button>
    </div>
  );
}
