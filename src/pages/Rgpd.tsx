import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { RGPD } from '@/content/legal';

export default function Rgpd() {
  return <LegalDocumentPage doc={RGPD} canonicalPath="/rgpd" showConsentButton />;
}
