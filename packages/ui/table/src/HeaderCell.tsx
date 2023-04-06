import clsx from 'clsx';

interface TableHeaderCellProps
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {}

export const HeaderCell = ({
  children,
  className,
  ...restProps
}: TableHeaderCellProps) => {
  return (
    <th
      {...restProps}
      className={clsx(
        className,
        'text-zinc-700 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 border-t border-b border-t-zinc-300 dark:border-t-zinc-700 border-b-zinc-300 dark:border-b-zinc-700 first:border-l first:border-l-zinc-300 first:dark:border-l-zinc-700 last:border-r last:border-r-zinc-300 last:dark:border-r-zinc-700 first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br font-medium antialiased py-2 px-4 text-left leading-none text-xs leading-4'
      )}
    >
      {children}
    </th>
  );
};
