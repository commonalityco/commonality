import clsx from 'clsx';

interface TableRowProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {}

export const Row = ({ children, className, ...restProps }: TableRowProps) => {
  return (
    <tr {...restProps} className={clsx(className)}>
      {children}
    </tr>
  );
};
