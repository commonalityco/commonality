import React from 'react';
import * as framer from 'framer-motion';

const { motion } = framer;

export type ExpandProps = {
  isExpanded?: boolean;
  children?: React.ReactNode;
};

export function Expand({ isExpanded = false, children }: ExpandProps) {
  return (
    <motion.div
      initial={false}
      animate={
        isExpanded
          ? {
              opacity: 1,
              height: 'auto',
              transitionEnd: { overflow: 'initial' },
            }
          : { opacity: 0, height: 0, overflow: 'hidden' }
      }
      transition={{
        ease: 'easeOut',
        duration: 0.125,
      }}
    >
      {children}
    </motion.div>
  );
}
