'use server';
import cytoscape from 'cytoscape';
import { layoutOptions } from './layout-options';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

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
