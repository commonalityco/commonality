'use server';
import cytoscape from 'cytoscape';
import { layoutOptions } from './layout-options';
import dagre from 'cytoscape-dagre';
import popper from 'cytoscape-popper';

cytoscape.use(dagre);
cytoscape.use(popper);

export type OffloadRenderFn = ({
  graphJson,
}: {
  graphJson: Record<string, any>;
}) => Promise<Record<string, any>>;

export const getUpdatedGraphJson: OffloadRenderFn = async ({ graphJson }) => {
  const graph = cytoscape({
    headless: true,
    styleEnabled: true,
  });

  graph.json(graphJson);

  graph.layout(layoutOptions).run();
  return graph.json();
};
