/* eslint-disable unicorn/no-null */
'use client';
import { Package } from '@commonalityco/types';
import { Snippet, ScrollArea } from '@commonalityco/ui-design-system';
import { Document } from '@commonalityco/types';
import remarkGfm from 'remark-gfm';
import ReactMarkdown, { Components } from 'react-markdown';
import { HTMLAttributes, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import { useElementVisibility } from './hooks/use-element-visibility';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import Balancer from 'react-wrap-balancer';

interface TableOfContentsProperties {
  filenames: string[];
  activeFile: string | null;
  onFileClick: (filename: string) => void;
}

const sectionTitleStyles = cva(
  'cursor-pointer text-zinc-600 border-border border-l-2 border-zinc-50 dark:border-zinc-800 truncate pl-3 text-sm py-2 pr-3 w-full text-left rounded-r-md transition-all',
  {
    variants: {
      active: {
        true: 'border-l-zinc-800 dark:border-l-white text-zinc-800 dark:text-white bg-zinc-50 dark:bg-zinc-800',
        false: 'bg-transparent',
      },
    },
  }
);

const CodeBlock = ({
  language,
  children,
  theme,
}: {
  language: string;
  children: string | string[];
  theme: 'light' | 'dark';
}) => {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <SyntaxHighlighter
        // skiphtml="false"
        language={language || 'text'}
        // style={theme === 'dark' ? atomOneDark : atomOneLight}
        PreTag="div"
        customStyle={{
          padding: '0',
          background: 'transparent',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

const CustomPre = ({ ...properties }: HTMLAttributes<HTMLPreElement>) => {
  return (
    <div className="not-prose">
      <pre className="rounded-lg font-mono text-sm" {...properties} />
    </div>
  );
};

const TableOfContents = ({
  filenames,
  activeFile,
  onFileClick,
}: TableOfContentsProperties) => {
  return (
    <div className="sticky left-0 top-0">
      {filenames.map((filename) => (
        <button
          key={filename}
          className={sectionTitleStyles({ active: filename === activeFile })}
          onClick={() => onFileClick(filename)}
        >
          {filename}
        </button>
      ))}
    </div>
  );
};

function PanelContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grow flex-col overflow-hidden border-r border-border text-foreground">
      {children}
    </div>
  );
}

interface DocumentationMarkdownProperties {
  pkg: Package;
  children?: string;
  readme?: string;
  docs: Document[];
  theme: 'light' | 'dark';
}

export function DocumentationMarkdown({
  docs,
  pkg,
  theme,
}: DocumentationMarkdownProperties) {
  // eslint-disable-next-line unicorn/no-null
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [scrollContainerReference, setScrollContainerReference] =
    useState<HTMLElement>();

  const sectionReferences = useElementVisibility({
    elementIds: docs.map((document) => document.filename),
    onElementVisible: setActiveFile,
    root: scrollContainerReference,
  });

  const onFileClick = (filename: string) => {
    sectionReferences.get(filename)?.scrollIntoView({ behavior: 'smooth' });
  };

  const components: Components = useMemo(() => {
    return {
      pre: CustomPre,
      code({ inline, className, children, ...properties }) {
        const match = /language-(\w+)/.exec(className || '');

        return !inline && match ? (
          <CodeBlock language={match[1]} theme={theme} {...properties}>
            {String(children).replace(/\n$/, '')}
          </CodeBlock>
        ) : (
          <code className={`${className} font-mono`} {...properties}>
            {children}
          </code>
        );
      },
    };
  }, []);

  if (!pkg) {
    return <PanelContainer>No package</PanelContainer>;
  }

  return (
    <PanelContainer>
      {docs.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h4 className="mb-2">No documentation</h4>
            <div className="mx-auto max-w-lg">
              <Balancer>
                <p className="text-center">
                  Add a <Snippet size="sm">README.md</Snippet> file to the root
                  of your package or add any markdown file to the{' '}
                  <Snippet>/docs</Snippet> directory.
                </p>
              </Balancer>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full grow flex-nowrap gap-6 pl-6">
          <div className="w-60 shrink-0 basis-60 pt-6">
            <TableOfContents
              filenames={docs.map((document) => document.filename)}
              activeFile={activeFile}
              onFileClick={onFileClick}
            />
          </div>
          <ScrollArea
            className="relative h-full grow"
            ref={(element) => {
              if (!element) return;

              setScrollContainerReference(element);
            }}
          >
            <div>
              <div className="sticky top-0 z-10 h-6 bg-gradient-to-b from-white dark:from-zinc-900" />
              <div className="flex grow flex-col items-center">
                {docs.map((document) => {
                  return (
                    <div
                      className="relative mb-8 border-b border-zinc-200 pb-8 pr-6 last:border-none dark:border-zinc-800"
                      id={document.filename}
                      key={document.filename}
                      ref={(element) =>
                        element &&
                        sectionReferences.set(document.filename, element)
                      }
                    >
                      {/* <div className="absolute -top-16" id={document.filename} /> */}
                      <div id={`${document.filename}-content`}>
                        <ReactMarkdown
                          className="prose prose-zinc max-w-none font-sans dark:prose-invert"
                          remarkPlugins={[remarkGfm]}
                          components={components}
                        >
                          {document.content ?? 'No content'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="sticky bottom-0 z-10 h-6 bg-gradient-to-t from-white dark:from-zinc-900" />
            </div>
          </ScrollArea>
        </div>
      )}
    </PanelContainer>
  );
}
