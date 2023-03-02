import clsx from 'clsx';

export interface ContainerProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'maxWidth'
  > {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Container({
  children,
  className,
  maxWidth = 'xl',
  ...restProps
}: ContainerProps) {
  return (
    <div
      {...restProps}
      className={clsx(
        'my-0 mx-auto relative w-full',
        {
          'max-w-sm': maxWidth === 'xs',
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-screen-2xl': maxWidth === '2xl',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
