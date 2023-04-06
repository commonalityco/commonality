import clsx from 'clsx';
import React from 'react';

export interface ContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export function Content({ className, ...props }: ContentProps) {
  return <div {...props} className={clsx('p-6 relative', className)} />;
}
