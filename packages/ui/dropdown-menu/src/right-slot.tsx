'use client';

export const RightSlot = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  return <div {...props} className="ml-auto pl-4 text-zinc-500" />;
};
