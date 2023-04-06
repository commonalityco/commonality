import clsx from 'clsx';

interface FooterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <div
      {...props}
      className={clsx(
        'bg-zinc-50 p-2 border-t border-t-zinc-200 rounded-br-sm rounded-bl-sm',
        className
      )}
    />
  );
};
