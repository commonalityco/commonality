import type { ThemeName } from '@/hooks/useTheme';
import { ElementDefinition } from 'cytoscape';
import { createCytoscapeManager } from './cytoscapeManager';
import { pick } from 'lodash';

export interface GraphManagerOptions {}

export const createGraphManager = () => {
  const cytoscapeManager = createCytoscapeManager();
  let hasInitialized = false;

  const init = ({
    elements,
    container,
    theme,
  }: {
    elements: ElementDefinition[];
    container: HTMLElement;
    theme: ThemeName.Dark | ThemeName.Light;
  }) => {
    if (hasInitialized) return;

    cytoscapeManager.init({ elements, container, theme });

    hasInitialized = true;
  };

  return { init, ...pick(cytoscapeManager, ['setTheme', 'fit']) };
};
