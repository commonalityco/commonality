import clsx from 'clsx';

export function Step({
  children,
  active = false,
}: {
  children?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="flex items-center flex-nowrap gap-2">
      <div
        className={clsx('h-2 w-2 rounded-full mr-2', {
          'bg-zinc-800 dark:bg-white': active,
          'bg-zinc-400': !active,
        })}
      />
      <div
        className={clsx(
          {
            'text-zinc-800 dark:text-white': active,
            'text-zinc-400': !active,
          },
          'text-sm font-medium'
        )}
      >
        {children}
      </div>
    </div>
  );
}
