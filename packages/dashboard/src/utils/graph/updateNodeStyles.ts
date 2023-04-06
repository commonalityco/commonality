import { Core } from 'cytoscape';

export const updateNodeStyles = (graph: Core) => {
  graph.nodes().forEach((node) => {
    const width = node.data('width') || 400; // Use a default value if the attribute is not set
    const height = node.data('height') || 80; // Use a default value if the attribute is not set

    node.style({
      width: width,
      height: height,
    });
  });

  graph.fit(undefined, 24).resize();
  console.log('UPDATED ZOOM', graph.zoom());
};
