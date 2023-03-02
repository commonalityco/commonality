import clsx from 'clsx';

interface TextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  use?: 'help' | 'error' | 'code';
}

export const Text = ({ children, use, className, ...restProps }: TextProps) => {
  return (
    <p
      {...restProps}
      className={clsx(
        className,
        'text-sm text-zinc-600 no-underline antialiased dark:text-zinc-200',
        {
          'font-regular text-zinc-500 dark:text-zinc-400': use === 'help',
          'text-red-600': use === 'error',
          'inline-block font-mono font-medium': use === 'code',
        }
      )}
    >
      {children}
    </p>
  );
};
