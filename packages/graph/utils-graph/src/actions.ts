import {
  CollectionArgument,
  Core,
  Selector,
  NodeSingular,
  ElementDefinition,
} from 'cytoscape';

type Filter =
  | Selector
  | ((ele: NodeSingular, index: number, eles: CollectionArgument) => boolean);

type ActionFn = (options: {
  traverseGraph: Core;
  renderGraph: Core;
}) => ElementDefinition[];

// const withNoGraphSupport = (fn: (options: {  traversalGraph: Core; renderGraph: Core})=>void () =>{})

export const show = ({
  traversalGraph,
  renderGraph,
  selector,
}: {
  traversalGraph: Core;
  renderGraph: Core;
  selector: Filter;
}): ElementDefinition[] => {
  const matchingNodes = traversalGraph.nodes().filter(selector);
  const existingNodes = renderGraph.nodes();
  const nodesToRender = existingNodes.union(matchingNodes);
  const edgesToRender = nodesToRender.nodes().edgesTo(nodesToRender.nodes());
  const elementsToRender = nodesToRender.union(edgesToRender);

  return elementsToRender.jsons() as any;
};

export const showDependencies = ({
  traversalGraph,
  renderGraph,
  id,
}: {
  traversalGraph: Core;
  renderGraph: Core;
  id: string;
}): ElementDefinition[] => {
  const node = traversalGraph.$id(id);
  const nodeAndDependants = node.union(node.outgoers());
  const elementsToRender = renderGraph.elements().union(nodeAndDependants);

  return elementsToRender.jsons() as any;
};

export const showDependants = ({
  traversalGraph,
  renderGraph,
  id,
}: {
  traversalGraph: Core;
  renderGraph: Core;
  id: string;
}): ElementDefinition[] => {
  const node = traversalGraph.$id(id);
  const nodeAndDependants = node.union(node.incomers());
  const elementsToRender = renderGraph.elements().union(nodeAndDependants);

  return elementsToRender.jsons() as any;
};
