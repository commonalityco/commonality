'use client';
import { ElementDefinition } from 'cytoscape';
import { createGraphManager } from 'utils/graph/graphManager';
import { useAtom, useSetAtom } from 'jotai';
import { graphManagerAtom, visibleElementsAtom } from 'atoms/graph';
import { graphEvents } from 'utils/graph/graphEvents';
import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { VirtualElement } from '@popperjs/core';
import { Dependency, Package } from '@commonalityco/types';
import * as Card from '@commonalityco/ui-card';
import { Button } from '@commonalityco/ui-button';
import { TargetIcon } from '@radix-ui/react-icons';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';
import nodeHTMLLabel from 'cytoscape-node-html-label';

function Graph({ elements }: { elements: ElementDefinition[] }) {
  const [graphManager, setGraphManager] = useAtom(graphManagerAtom);
  const setVisibleElements = useSetAtom(visibleElementsAtom);

  return (
    <div className="relative z-10 h-full w-full bg-zinc-50 dark:bg-zinc-800">
      <Tooltip />
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
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

export default Graph;
