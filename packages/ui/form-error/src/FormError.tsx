import clsx from 'clsx';

interface FormErrorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const FormError = ({
  children,
  className,
  ...restProps
}: FormErrorProps) => {
  return (
    <div
      {...restProps}
      className={clsx('flex flex-nowrap gap-2 items-center mt-2', className)}
    >
      <span role="alert" className="text-red-600 text-sm font-semibold">
        {children}
      </span>
    </div>
  );
};
