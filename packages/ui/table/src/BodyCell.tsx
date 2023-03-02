import clsx from 'clsx';

interface TableBodyCellProps
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {}

export const BodyCell = ({
  children,
  className,
  ...restProps
}: TableBodyCellProps) => {
  return (
    <td
      {...restProps}
      className={clsx(
        'text-sm font-medium antialiased p-4 text-left leading-none text-zinc-800 dark:text-white border-b border-zinc-300 dark:border-zinc-700',
        className
      )}
    >
      {children}
    </td>
  );
};
