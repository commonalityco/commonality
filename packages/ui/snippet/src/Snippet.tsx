import clsx from 'clsx';

export interface SnippetProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  size?: 'sm' | 'md' | 'lg';
  showPrompt?: boolean;
}

export function Snippet({
  children,
  className,
  size = 'md',
  showPrompt = true,
  ...restProps
}: SnippetProps) {
  return (
    <div className="inline-block">
      <div
        {...restProps}
        className={clsx(
          'flex items-center rounded border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800',
          className,
          {
            'h-7 py-0 px-3 text-xs': size === 'sm',
            'h-9 py-0 px-4 text-sm': size === 'md',
            'h-11 py-0 px-5 text-sm': size === 'lg',
          }
        )}
      >
        <div className="flex flex-nowrap gap-3">
          {showPrompt && (
            <span className="select-none !font-mono font-medium text-zinc-400 dark:text-zinc-500">
              $
            </span>
          )}
          <p className="!font-mono font-medium text-zinc-800 dark:text-white">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
