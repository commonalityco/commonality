import React from 'react';

export function Title({ children }: { children?: React.ReactNode }) {
  return (
    <p className="pt-2 mb-2 flex items-center text-md font-semibold antialiased text-zinc-800 dark:text-white">
      {children}
    </p>
  );
}
