'use client';
import { memo, useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instantiationRef = useRef(false);
  const setVisibleElements = useSetAtom(visibleElementsAtom);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = createGraphManager({ container: containerRef.current });

    instance.init({
      elements,
      onRender: (graph) => {
        setVisibleElements(graph.nodes());
      },
    });

    instantiationRef.current = true;

    return () => instance.destroy();
  }, [elements, setVisibleElements]);

  return (
    <div className="relative z-10 h-full w-full bg-zinc-100 dark:bg-zinc-800">
      <Tooltip stripScope={stripScopeFromPackageNames} />
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

export default memo(Graph);
