import clsx from 'clsx';
import { Toaster as HotToaster, resolveValue } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 1000,
      }}
    >
      {(t) => {
        return (
          <div
            className={clsx(
              'rounded-md py-4 px-5 shadow min-w-[w-64] text-sm text-white font-sans',
              {
                'bg-sky-600': ['loading', 'custom', 'blank'].includes(t.type),
                'bg-red-600': t.type === 'error',
                'bg-emerald-600': t.type === 'success',
              }
            )}
          >
            {resolveValue(t.message, t)}
          </div>
        );
      }}
    </HotToaster>
  );
}
