import clsx from 'clsx';

export interface StaticInputLabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export function StaticInputLabel({
  children,
  className,
  ...restProps
}: StaticInputLabelProps) {
  return (
    <label
      {...restProps}
      className={clsx(
        'inline-block border-t border-b border-l border-zinc-300 dark:border-zinc-600 px-3 py-2 h-9 rounded-tl rounded-bl text-sm font-sans antialiased bg-zinc-100 dark:bg-zinc-800 dark:text-white',
        className
      )}
    >
      {children}
    </label>
  );
}
