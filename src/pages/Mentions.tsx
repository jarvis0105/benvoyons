import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { MENTIONS } from '@/content/legal';

export default function Mentions() {
  return <LegalDocumentPage doc={MENTIONS} canonicalPath="/mentions-legales" />;
}
