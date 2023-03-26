'use client';
import { memo } from 'react';
import { ElementDefinition } from 'cytoscape';
import { createGraphManager } from 'utils/graph/graphManager';
import { useSetAtom } from 'jotai';
import { visibleElementsAtom } from 'atoms/graph';
import Tooltip from './Tooltip';

function Graph({
  elements,
  stripScopeFromPackageNames,
}: {
  elements: ElementDefinition[];
  stripScopeFromPackageNames?: boolean;
}) {
  const setVisibleElements = useSetAtom(visibleElementsAtom);

  return (
    <div className="relative z-10 h-full w-full bg-zinc-100 dark:bg-zinc-800">
      <Tooltip stripScope={stripScopeFromPackageNames} />
      <div
        ref={(el) => {
          if (!el) return;

          const instance = createGraphManager({ container: el });
          instance.init({
            elements,
            onRender: (elements) => {
              setVisibleElements(elements);
            },
          });
        }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

export default memo(Graph);
