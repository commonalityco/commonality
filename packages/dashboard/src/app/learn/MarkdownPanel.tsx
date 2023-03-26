'use client';
import 'client-only';
import { Package } from '@commonalityco/types';
import { Heading } from '@commonalityco/ui-heading';
import { Text } from '@commonalityco/ui-text';
import { getIconForPackage } from 'utils/get-icon-for-package';
import { Document } from '@commonalityco/types';
import { Divider } from '@commonalityco/ui-divider';
import { activeDocumentAtom } from 'app/learn/markdownPanelAtom';
import { Provider, useSetAtom } from 'jotai';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import MarkdownTableOfContents from 'app/learn/MarkdownTableOfContents';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { useHydrateAtoms } from 'jotai/utils';
import { usePathname } from 'next/navigation';

interface MarkdownPanelProps {
  pkg?: Package;
  children?: string;
  readme?: string;
  docs: Document[];
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="prose prose-zinc dark:prose-invert"
      remarkPlugins={[remarkGfm]}
    >
      {children ?? 'No content'}
    </ReactMarkdown>
  );
}

const ExtendedDocumentSection = ({ doc }: { doc: Document }) => {
  return (
    <div className="relative">
      <div className="absolute -top-16" id={doc.filename} />
      <div id={`${doc.filename}-content`}>
        <Markdown>{doc.content ?? 'No content'}</Markdown>
      </div>
    </div>
  );
};

ExtendedDocumentSection.displayName = 'ExtendedDocumentSection';

function DocumentationSection({ docs }: { docs: Document[] }) {
  return (
    <div className="flex grow flex-nowrap gap-7 py-3 px-6">
      <div className="basis-36">
        <MarkdownTableOfContents docs={docs} />
      </div>
      <div>
        {docs.length ? (
          <div className="flex grow flex-col items-center">
            {docs.map((doc, index) => {
              return <ExtendedDocumentSection doc={doc} key={doc.filename} />;
            })}
          </div>
        ) : (
          <div className="flex items-center pl-80">
            <Text>No README</Text>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelContainer({
  children,
  docs,
}: {
  children: React.ReactNode;
  docs: Document[];
}) {
  useHydrateAtoms([[activeDocumentAtom, 'README'] as any]);
  const setActiveDocument = useSetAtom(activeDocumentAtom);
  const containerRef = useIntersectionObserver({
    elementIds: docs.map((doc) => `${doc.filename}-content`),
    onIntersect: (el) => {
      const id = el.id.replace('-content', '');
      setActiveDocument(id);
    },
  });

  return (
    <div
      ref={containerRef}
      className="flex grow flex-col overflow-auto border-r border-zinc-100 text-white dark:border-zinc-800"
    >
      {children}
    </div>
  );
}

function MarkdownPanel({ docs, pkg }: MarkdownPanelProps) {
  if (!pkg) {
    return (
      <Provider>
        <PanelContainer docs={docs}>No package</PanelContainer>
      </Provider>
    );
  }

  return (
    <Provider>
      <PanelContainer docs={docs}>
        <DocumentationSection docs={docs} />
      </PanelContainer>
    </Provider>
  );
}

export default MarkdownPanel;
