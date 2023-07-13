import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import ReactMarkdown, { Components } from 'react-markdown';
import { HTMLAttributes, useMemo } from 'react';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import atomOneLight from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

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
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
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
    <div className="not-prose w-full max-w-md overflow-hidden">
      <pre
        className="w-full overflow-auto rounded-lg font-mono text-sm"
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
          <code className={`${className} font-mono`} {...properties}>
            {children}
          </code>
        );
      },
    };
  }, []);

  return (
    <ReactMarkdown
      className="prose prose-zinc dark:prose-invert max-w-none font-sans"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={components}
    >
      {children ?? 'No content'}
    </ReactMarkdown>
  );
}
