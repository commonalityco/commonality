import clsx from 'clsx';

export function Separator({ active = false }: { active?: boolean }) {
  return (
    <div
      className={clsx('w-px bg-zinc-400 grow h-10 ml-[3px]', {
        'bg-zinc-800': active,
      })}
    />
  );
}
