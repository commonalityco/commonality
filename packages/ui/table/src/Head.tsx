import clsx from 'clsx';

interface TableHeadProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

export const Head = ({ children, className, ...restProps }: TableHeadProps) => {
  return (
    <thead {...restProps} className={clsx(className, '')}>
      {children}
    </thead>
  );
};
