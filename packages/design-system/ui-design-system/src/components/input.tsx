import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../utils/cn';

const inputVariants = cva(
  'border hover:border-input bg-muted placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full shrink-0 rounded-md px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50'
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants(), className)}
      ref={ref}
      {...props}
    />
  );
});
