'use client';
import { IconButton } from '@commonalityco/ui-icon-button';
import {
  ArrowsPointingInIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { graphManagerAtom } from 'atoms/graph';
import { useAtomValue } from 'jotai';

function GraphNavigationButtons() {
  const graphManager = useAtomValue(graphManagerAtom);

  return (
    <div className="absolute z-20 top-3 right-3 border border-zinc-300 dark:border-zinc-600 rounded z-100 flex flex-col p-1 gap-1 bg-white dark:bg-zinc-900 shadow">
      <IconButton use="ghost">
        <PlusIcon className="h-4 w-4" />
      </IconButton>
      <IconButton use="ghost">
        <MinusIcon className="h-4 w-4" />
      </IconButton>
      <IconButton use="ghost">
        <ArrowsPointingInIcon
          className="h-4 w-4"
          onClick={() => graphManager?.fit('nodes', 24)}
        />
      </IconButton>
    </div>
  );
}

export default GraphNavigationButtons;
