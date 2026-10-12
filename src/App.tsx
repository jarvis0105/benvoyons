import { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CookieBanner } from '@/components/CookieBanner';
import { PageTransition } from '@/components/PageTransition';
import { IntroCurtain } from '@/components/IntroCurtain';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LangProvider } from '@/i18n';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { useScrub } from '@/hooks/useScrub';
import { resetScroll } from '@/lib/smoothScroll';

/* L'accueil est chargé immédiatement — c'est la porte d'entrée du
   site. Les autres pages sont découpées en fichiers séparés, que le
   navigateur ne télécharge qu'au moment où le visiteur y va. Cela
   allège nettement le premier affichage. */
import Home from '@/pages/Home';

const About = lazy(() => import('@/pages/About'));
const Menus = lazy(() => import('@/pages/Menus'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const Contact = lazy(() => import('@/pages/Contact'));
const Reservation = lazy(() => import('@/pages/Reservation'));
const Cgu = lazy(() => import('@/pages/Cgu'));
const Rgpd = lazy(() => import('@/pages/Rgpd'));
const Mentions = lazy(() => import('@/pages/Mentions'));
const NotFound = lazy(() => import('@/pages/not-found'));

/* Écran d'attente sobre : quelques dizaines de millisecondes en
   général, il ne doit surtout pas clignoter. */
function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-hidden="true" />;
}

/* Chaque page est servie en français à la racine et en anglais
   sous /en — deux URL distinctes, indexables séparément. */
const ROUTES = [
  { path: '/', component: Home },
  { path: '/a-propos', component: About },
  { path: '/menus', component: Menus },
  { path: '/avis', component: Reviews },
  { path: '/contact', component: Contact },
  { path: '/reservation', component: Reservation },
  { path: '/cgu', component: Cgu },
  { path: '/rgpd', component: Rgpd },
  { path: '/mentions-legales', component: Mentions },
];

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    resetScroll();
  }, [location]);
  return null;
}

function Routes() {
  return (
    <Switch>
      {ROUTES.map((r) => (
        <Route key={r.path} path={r.path} component={r.component} />
      ))}
      {ROUTES.map((r) => (
        <Route
          key={`en${r.path}`}
          path={r.path === '/' ? '/en' : `/en${r.path}`}
          component={r.component}
        />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Mounted once for the whole app: a single Lenis instance persists across
  // client-side navigation, and the reveal/parallax engine re-attaches
  // itself automatically to every page swap via its internal MutationObserver.
  //
  // Un seul écran d'ouverture (IntroCurtain) — pas deux. Le projet a
  // porté un moment `LoadingScreen`, une seconde implémentation du même
  // principe (voile + monogramme + fondu), montée EN PLUS d'IntroCurtain
  // plutôt qu'à sa place. Au-delà du doublon visuel, LoadingScreen ne
  // verrouillait ni le défilement ni Lenis : la page restait défilable
  // derrière son voile opaque, et l'IntersectionObserver du moteur de
  // révélation — indifférent à ce qui est visuellement masqué, il ne
  // regarde que la géométrie — révélait alors les sections en silence
  // pendant qu'on ne pouvait rien en voir. Au moment où le voile se
  // levait, tout était déjà à son état final : aucune animation
  // perceptible. Supprimé ; IntroCurtain fait tout ce que LoadingScreen
  // faisait, avec en plus le verrouillage du défilement, l'interruption
  // au clic et la mémorisation par session.
  useSmoothScroll();
  useScrollAnimations();
  useScrub();

  return (
      <TooltipProvider>
        <LangProvider>
          <ScrollToTop />
          <IntroCurtain />
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <PageTransition>
                <Routes />
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
          <CookieBanner />
        </LangProvider>
        <Toaster />
      </TooltipProvider>
  );
}

export default App;
