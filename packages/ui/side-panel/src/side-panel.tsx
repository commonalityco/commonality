import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@commonalityco/ui-icon';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export interface SidePanelProps {
  title?: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function SidePanel({
  title,
  isOpen,
  onClose,
  children,
}: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="absolute right-0 top-0 bottom-0 z-50 border-l border-zinc-300 bg-white py-3 pr-3 pl-5 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              {title ? (
                <p className="text-md font-medium text-zinc-800 dark:text-white">
                  {title}
                </p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
              aria-label="Close"
            >
              <Icon icon={faClose} className="text-zinc-800 dark:text-white" />
            </button>
          </div>
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
