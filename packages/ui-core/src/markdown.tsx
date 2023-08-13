import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import ReactMarkdown, { Components } from 'react-markdown';
import { HTMLAttributes, useMemo } from 'react';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import atomOneLight from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import { cn } from '@commonalityco/ui-design-system';

const CodeBlock = ({
  language,
  children,
  theme,
}: {
  language: string;
  children: string;
  theme: 'light' | 'dark';
}) => {
  const style = theme === 'dark' ? atomOneDark : atomOneLight;

  return (
    <div className="bg-muted w-full rounded-md p-2">
      <SyntaxHighlighter
        language={language}
        style={style}
        PreTag="div"
        useInlineStyles={true}
        customStyle={{
          padding: '0',
          background: 'transparent',
        }}
      >
        {children.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

const CustomPre = ({ ...properties }: HTMLAttributes<HTMLPreElement>) => {
  return (
    <div className="not-prose w-full overflow-hidden">
      <pre
        className="w-full overflow-auto rounded-md font-mono text-sm"
        {...properties}
      />
    </div>
  );
};

interface MarkdownProps {
  theme?: 'light' | 'dark';
  children?: string;
}

export function Markdown({ theme = 'light', children }: MarkdownProps) {
  const components: Components = useMemo(() => {
    return {
      a: ({ node: _node, ...props }) => (
        <a {...props} target="_blank" rel="noopener noreferrer" />
      ),
      pre: CustomPre,
      code({ inline, className, children, ...properties }) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match?.[1] ?? 'text';
        const childString = typeof children[0] === 'string' ? children[0] : '';

        return !inline && match ? (
          <CodeBlock language={language} theme={theme} {...properties}>
            {childString}
          </CodeBlock>
        ) : (
          <code className={cn('font-mono', className)} {...properties}>
            {children}
          </code>
        );
      },
    };
  }, [theme, children]);

  return (
    <ReactMarkdown
      className="prose prose-zinc dark:prose-invert max-w-none font-sans"
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {children ?? 'No content'}
    </ReactMarkdown>
  );
}
