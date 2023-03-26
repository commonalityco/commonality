'use client';
import { IconButton } from '@commonalityco/ui-icon-button';
import {
  ArrowsPointingInIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { graphEvents } from 'utils/graph/graphEvents';

function GraphNavigationButtons() {
  return (
    <div className="z-100 absolute top-3 right-3 z-20 flex flex-col gap-1 rounded-lg border border-zinc-100 bg-white p-1 shadow dark:border-zinc-800 dark:bg-zinc-900">
      <IconButton
        use="ghost"
        size="sm"
        onClick={() => graphEvents.emit('ZoomIn')}
      >
        <PlusIcon className="h-4 w-4" />
      </IconButton>
      <IconButton
        use="ghost"
        size="sm"
        onClick={() => graphEvents.emit('ZoomOut')}
      >
        <MinusIcon className="h-4 w-4" />
      </IconButton>
      <IconButton use="ghost" size="sm">
        <ArrowsPointingInIcon
          className="h-4 w-4"
          onClick={() =>
            graphEvents.emit('Fit', { selector: 'node, edge', padding: 24 })
          }
        />
      </IconButton>
    </div>
  );
}

export default GraphNavigationButtons;
