import { Check, Copy } from 'lucide-react';
import React, { useRef } from 'react';
import { Button, cn } from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { track } from '@vercel/analytics';

export function CopySnippet({
  children,
  className,
  buttonClassName,
}: {
  children: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutId = useRef(null);

  const handleClick = () => {
    track('copied-to-clipboard', {
      snippet: children,
    });

    navigator.clipboard.writeText(children);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    setCopied(true);

    timeoutId.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        'py-1 pr-1 pl-5 flex gap-3 flex-nowrap items-center rounded-md border border-border group',
        className,
      )}
    >
      <p className="font-mono text-primary font-medium">{children}</p>

      <Button
        onClick={handleClick}
        variant="ghost"
        size="icon"
        aria-label="Copy command"
        className={cn('cursor-pointer z-10 rounded-sm', buttonClassName)}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}
