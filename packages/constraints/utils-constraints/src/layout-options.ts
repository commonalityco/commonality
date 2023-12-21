import { BaseLayoutOptions } from 'cytoscape';
import { DagreLayoutOptions } from 'cytoscape-dagre';

export const layoutOptions: DagreLayoutOptions & BaseLayoutOptions = {
  name: 'dagre',
  animate: false,
  rankSep: 240,
  nodeSep: 140,
  nodeDimensionsIncludeLabels: true,
};
