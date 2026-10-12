import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import { EasterEgg } from "@/components/EasterEgg";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/i18n";
import { onScrollFrame, scrollToElement } from "@/lib/smoothScroll";
import { useAmbiance } from "@/lib/ambiance";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useLang();
  const [showBackToTop, setShowBackToTop] = useState(false);
  /* Pose `data-ambiance` (jour / soir) sur <html>, d'après la lumière d'Angers. */
  useAmbiance();

  /* Bouton « remonter en haut » : visible sur grand écran une fois le
     pied de page atteint. La page défile nativement (voir
     smoothScroll.ts) : plus de conteneur transformé à enregistrer. */
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    return onScrollFrame(() => {
      if (!desktop.matches) {
        setShowBackToTop(false);
        return;
      }
      const footer = document.querySelector(".lts-footer");
      setShowBackToTop(footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false);
    });
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-brand-strong selection:text-white font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:h-12 focus:px-6 focus:items-center focus:bg-background focus:text-foreground focus:border focus:border-border"
      >
        {t("Aller au contenu")}
      </a>
      <EasterEgg />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <BookingModal />
      <button
        type="button"
        onClick={() => scrollToElement()}
        className={`back-to-top ${showBackToTop ? "back-to-top-visible" : ""}`}
        aria-label={t("Remonter en haut de page")}
        data-testid="button-back-to-top"
      >
        <ArrowUp className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
