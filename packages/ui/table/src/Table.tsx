import clsx from 'clsx';

interface TableProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {}

export const Root = ({ children, className, ...restProps }: TableProps) => {
  return (
    <table
      {...restProps}
      className={clsx(className, 'w-full border-separate border-spacing-0')}
    >
      {children}
    </table>
  );
};

interface TableBodyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

export const Body = ({ children, className, ...restProps }: TableBodyProps) => {
  return (
    <tbody {...restProps} className={clsx(className, '')}>
      {children}
    </tbody>
  );
};
