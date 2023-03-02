'use client';
import 'client-only';
import { ElementDefinition } from 'cytoscape';
import { createGraphManager } from 'utils/graph/graphManager';
import { useAtom, useSetAtom } from 'jotai';
import { graphManagerAtom, visibleElementsAtom } from 'atoms/graph';

function Graph({ elements }: { elements: ElementDefinition[] }) {
  const [graphManager, setGraphManager] = useAtom(graphManagerAtom);
  const setVisibleElements = useSetAtom(visibleElementsAtom);

  return (
    <>
      <div
        ref={(el) => {
          if (!el || graphManager) return;

          const instance = createGraphManager({ container: el });
          instance.init({
            elements,
            onRender: (elements) => {
              setVisibleElements(elements);
            },
          });
          setGraphManager(instance);
        }}
        className="relative z-10 h-full w-full dark:bg-zinc-800 bg-zinc-50 cursor-grab active:cursor-grabbing"
      />
    </>
  );
}

export default Graph;
