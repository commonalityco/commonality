import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface SkeletonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  height?: string;
  width?: string;
}

export function Skeleton({ className, ...restProps }: SkeletonProps) {
  return (
    <div
      {...restProps}
      className={clsx(
        'relative block overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800',
        className
      )}
    >
      <motion.div
        className="skew-[-30deg] pointer-events-none absolute right-0 top-0 bottom-0 h-full w-full transform select-none bg-gradient-to-r from-zinc-100 via-white to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"
        animate={{ x: ['-110%', '110%'], skew: ['-30deg', '-30deg'] }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1,
          repeatDelay: 0.75,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}
