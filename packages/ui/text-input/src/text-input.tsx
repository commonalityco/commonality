import React from 'react';
import { Icon } from '@commonalityco/ui-icon';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

export interface TextInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'size'
  > {
  isSuccessful?: boolean;
  hasError?: boolean;
  use?: 'primary' | 'secondary';
  search?: boolean;
  size?: 'md' | 'lg';
  autoComplete?: 'on' | 'off';
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      type,
      use,
      search,
      size,
      id,
      className,
      autoComplete = 'off',
      ...restProps
    }: TextInputProps,
    ref
  ) => {
    return (
      <div className={clsx('relative', className)}>
        {search && (
          <label
            htmlFor={id}
            className={clsx('absolute top-0 bottom-0 text-zinc-400', {
              'top-1 left-3 text-base': size === 'md',
              'top-8 left-10 text-lg': size === 'lg',
            })}
          >
            <Icon icon={faMagnifyingGlass} transform={{ y: 2 }} />
          </label>
        )}
        <input
          {...restProps}
          autoComplete={autoComplete}
          id={id}
          className={clsx(
            'appearance-none rounded font-sans cursor-text w-full border border-solid outline-none border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 focus:border-sky-600 dark:focus:border-sky-400 text-ellipsis align-middle text-zinc-800 dark:text-white placeholder:text-zinc-500  aria-invalid:border-red-600 antialiased bg-zinc-50 dark:bg-zinc-800 focus:shadow-[0_0_0_3px_black] focus:shadow-sky-300/50 focus:dark:shadow-sky-700/[0.5] transition',
            {
              'p-3 h-9 text-sm': size === 'md',
              'p-4 text-lg h-10': size === 'lg',
              'pl-9': search,
            }
          )}
          ref={ref}
          type="text"
        />
      </div>
    );
  }
);

TextInput.defaultProps = {
  use: 'primary',
  size: 'md',
};
