import type { ComponentProps } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import clsx from 'clsx';

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Image> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: 'sm' | 'md';
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...restProps
}: AvatarProps) {
  const fallbackText = fallback?.slice(0, 2).toUpperCase();

  return (
    <AvatarPrimitive.Root
      className={clsx(
        className,
        'inline-flex items-center justify-content align-middle overflow-hidden select-none rounded-full',
        {
          'w-5 h-5': size === 'sm',
          'w-9 h-9': size === 'md',
        }
      )}
    >
      <AvatarPrimitive.Image
        {...restProps}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <AvatarPrimitive.Fallback
        delayMs={600}
        className="w-full h-full flex items-center justify-center bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-white text-xs font-semibold leading-none"
      >
        {fallbackText}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
