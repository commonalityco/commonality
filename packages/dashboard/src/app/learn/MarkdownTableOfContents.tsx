'use client';

import { Document } from '@commonalityco/types';
import { activeDocumentAtom } from 'app/learn/markdownPanelAtom';
import { cva } from 'class-variance-authority';
import { useAtomValue } from 'jotai';
import { twMerge } from 'tailwind-merge';

const titleButtonStyles = cva('transition-all font-xs mb-6 block font-sans', {
  variants: {
    active: {
      true: 'dark:text-white text-zinc-800',
      false: 'dark:text-zinc-700 text-zinc-400',
    },
  },
});

function TitleButton({
  filename,
  className,
}: {
  filename: string;
  className?: string;
}) {
  const activeDocument = useAtomValue(activeDocumentAtom);
  const active = activeDocument === filename;

  return (
    <a
      className={twMerge(titleButtonStyles({ className, active }))}
      href={`#${filename}`}
    >
      {filename}
    </a>
  );
}

function MarkdownTableOfContents({ docs }: { docs: Document[] }) {
  return (
    <div className="sticky top-20">
      {docs.map((doc) => {
        return <TitleButton key={doc.filename} filename={doc.filename} />;
      })}
    </div>
  );
}

export default MarkdownTableOfContents;
