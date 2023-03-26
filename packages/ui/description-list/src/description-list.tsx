import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

interface RootProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {}

const rootStyles = cva('m-0');

export function Root({ className, children, ...props }: RootProps) {
  return (
    <dl {...props} className={twMerge(rootStyles({ className }))}>
      {children}
    </dl>
  );
}

interface TermProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

const termStyles = cva(
  'm-0 font-sans text-zinc-800 dark:text-white mb-2 text-xs font-medium'
);

export function Term({ children, className, ...props }: TermProps) {
  return (
    <dt {...props} className={twMerge(termStyles({ className }))}>
      {children}
    </dt>
  );
}

interface DetailsProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

const descriptionStyles = cva(
  'mb-4 last:mb-0 text-zinc-500 dark:text-zinc-400 text-xs'
);

export function Details({ children, className, ...props }: DetailsProps) {
  return (
    <dd {...props} className={twMerge(descriptionStyles({ className }))}>
      {children}
    </dd>
  );
}
