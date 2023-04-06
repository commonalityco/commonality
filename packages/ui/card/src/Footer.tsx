import clsx from 'clsx';

export interface FooterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Footer = ({ className, ...restProps }: FooterProps) => {
  return (
    <div
      {...restProps}
      className={clsx(
        'bg-zinc-50 dark:bg-zinc-800 py-4 px-6 border-solid border-t border-zinc-100 dark:border-zinc-800 rounded-bl-md rounded-br-md',
        className
      )}
    />
  );
};
