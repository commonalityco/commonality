import { DocumentationMarkdown } from './documentation-markdown';
import { DocumentationDetails } from './documentation-details';
import { Package, Document } from '@commonalityco/types';

interface DocumentationLayoutProperties {
  children?: React.ReactNode;
}

export function DocumentationLayout({
  children,
}: DocumentationLayoutProperties) {
  return (
    <div className="flex max-h-screen grow gap-3 overflow-hidden bg-secondary p-3">
      {children}
    </div>
  );
}

export function DocumentationContentSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grow overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-background">
        {children}
      </div>
    </div>
  );
}

export function DocumentationLayoutContent({
  pkg,
  docs,
  theme,
}: {
  pkg: Package;
  docs: Document[];
  theme: 'light' | 'dark';
}) {
  return (
    <div className="flex grow flex-nowrap overflow-hidden">
      <DocumentationMarkdown pkg={pkg} docs={docs} theme={theme} />
      <DocumentationDetails pkg={pkg} />
    </div>
  );
}
