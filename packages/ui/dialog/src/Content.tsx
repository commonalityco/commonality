import { Icon } from '@commonalityco/ui-icon';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import * as RadixDialog from '@radix-ui/react-dialog';

export interface DialogProps
  extends Omit<RadixDialog.DialogContentProps, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function Content({
  children,
  title,
  description,
  ...restProps
}: DialogProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-zinc-400/70 dark:bg-zinc-800/70 blur" />
      <RadixDialog.Content
        {...restProps}
        className="bg-white dark:bg-zinc-900 rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] p-6 max-w-md max-h-[85vh] border border-zinc-100 dark:border-zinc-800"
      >
        <RadixDialog.Title className="m-0 font-medium text-lg text-zinc-800 dark:text-white antialiased">
          {title}
        </RadixDialog.Title>
        <RadixDialog.Description className="text-zinc-600 dark:text-zinc-200 antialiased text-sm mb-4">
          {description}
        </RadixDialog.Description>
        {children}
        <RadixDialog.Close asChild>
          <button
            className="absolute top-4 right-4 inline-flex items-center justify-center h-8 w-8 rounded hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
            aria-label="Close"
          >
            <Icon icon={faClose} className="text-zinc-800 dark:text-white" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
