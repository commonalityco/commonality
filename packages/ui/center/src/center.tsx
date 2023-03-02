import clsx from 'clsx';
import { forwardRef } from 'react';

export interface CenterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ className, ...props }: CenterProps, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={clsx('flex items-center justify-center w-full', className)}
      />
    );
  }
);
