import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { LegalPage, Section } from '@/components/LegalPage';
import { useLang } from '@/i18n';
import { clearConsent } from '@/lib/consent';
import type { LegalDocument } from '@/content/legal';

/**
 * Affiche un document légal fourni par le restaurant, tel quel.
 * Le texte n'est jamais traduit : la version française fait foi.
 */
export function LegalDocumentPage({
  doc,
  canonicalPath,
  showConsentButton = false,
}: {
  doc: LegalDocument;
  canonicalPath: string;
  /** Affiche le bouton permettant de revenir sur son choix de cookies. */
  showConsentButton?: boolean;
}) {
  const { lang, t } = useLang();

  return (
    <Layout>
      <SEO
        title={doc.metaTitle}
        description={doc.metaDescription}
        canonicalPath={canonicalPath}
      />
      <LegalPage title={doc.title} intro={doc.intro} eyebrow={t('Informations légales')}>
        {lang === 'en' && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-brand-strong/40 pl-4">
            This legal document is only available in French, as the French
            version is the one that applies.
          </p>
        )}

        {doc.sections.map((section, i) => {
          const body = section.blocks.map((block, j) => {
            if (block.kind === 'list') {
              return (
                <ul key={j} className="list-disc pl-5 space-y-2">
                  {block.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.kind === 'note') {
              return (
                <p key={j} className="font-medium tracking-wide text-foreground">
                  {block.text}
                </p>
              );
            }
            return <p key={j}>{block.text}</p>;
          });

          if (section.title) {
            return (
              <Section key={i} title={section.title}>
                {body}
              </Section>
            );
          }
          return (
            <div
              key={i}
              className="space-y-3 text-sm leading-relaxed text-foreground/80"
            >
              {body}
            </div>
          );
        })}
        {showConsentButton && (
          <Section title={t('Vos choix sur ce site')}>
            <p>
              {t(
                'Ce site ne charge aucun service extérieur sans votre accord. Vous pouvez revenir sur votre choix à tout moment.',
              )}
            </p>
            <button
              onClick={() => clearConsent()}
              className="inline-flex items-center px-5 py-2.5 border border-foreground/25 text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors cursor-pointer"
              data-testid="btn-reopen-consent"
            >
              {t('Modifier mes choix de cookies')}
            </button>
          </Section>
        )}
      </LegalPage>
    </Layout>
  );
}
