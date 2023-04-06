import clsx from 'clsx';

export interface LabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export function Label({ children, className, ...restProps }: LabelProps) {
  return (
    <label
      {...restProps}
      className={clsx(
        'inline-block font-sans font-semibold text-sm text-zinc-800 dark:text-white mb-2 antialiased',
        className
      )}
    >
      {children}
    </label>
  );
}
