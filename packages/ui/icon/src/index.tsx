'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ComponentProps } from 'react';

export interface IconProps extends ComponentProps<typeof FontAwesomeIcon> {}

export function Icon({ className, ...props }: IconProps) {
  return (
    <FontAwesomeIcon className={clsx('text-inherit', className)} {...props} />
  );
}
