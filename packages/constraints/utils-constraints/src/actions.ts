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

type GraphActionFunction<Arguments> = (
  arguments_: Arguments,
) => CollectionArgument;
function withSerialization<Arguments>(
  function_: GraphActionFunction<Arguments>,
) {
  return (arguments_: Arguments): ElementDefinition[] => {
    const result = function_(arguments_);

    return result.jsons() as unknown as ElementDefinition[];
  };
}

export const show = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    selector,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    selector: Filter;
  }) => {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const matchingNodes = traversalGraph.nodes().filter(selector);

    const existingNodes = renderGraph.nodes();
    const nodesToRender = existingNodes.union(matchingNodes);
    const edgesToRender = nodesToRender.nodes().edgesTo(nodesToRender.nodes());
    const elementsToRender = nodesToRender.union(edgesToRender);

    return elementsToRender;
  },
);

export const showDependencies = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    id,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    id: string;
  }) => {
    const node = traversalGraph.$id(id);
    const nodeAndDependants = node.union(node.outgoers());
    const elementsToRender = renderGraph.elements().union(nodeAndDependants);

    return elementsToRender;
  },
);

export const showDependants = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    id,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    id: string;
  }) => {
    const node = traversalGraph.$id(id);
    const nodeAndDependants = node.union(node.incomers());

    const nodesToRender = nodeAndDependants.nodes();
    const edgesToRender = nodesToRender.edgesTo(nodesToRender);

    const elementsToRender = renderGraph
      .elements()
      .union(nodesToRender)
      .union(edgesToRender);

    return elementsToRender;
  },
);

export const setInitialElements = withSerialization(
  ({ renderGraph }: { renderGraph: Core }) => {
    return renderGraph.elements();
  },
);

export const focus = withSerialization(
  ({
    traversalGraph,
    selector,
  }: {
    traversalGraph: Core;
    selector: Filter;
  }) => {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const matchingNodes = traversalGraph.nodes().filter(selector);
    const edgesToRender = matchingNodes.edgesTo(matchingNodes);

    return traversalGraph
      .collection()
      .union(matchingNodes)
      .union(edgesToRender);
  },
);

export const showAll = withSerialization(
  ({ traversalGraph }: { traversalGraph: Core }) => {
    return traversalGraph.elements();
  },
);

export const hideAll = withSerialization(
  ({ traversalGraph }: { traversalGraph: Core }) => {
    return traversalGraph.collection();
  },
);

export const hideDependents = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    id,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    id: string;
  }) => {
    const successorsOfNode = renderGraph.$id(id).successors();
    const successorsOfDirectDependents = traversalGraph
      .$id(id)
      .incomers()
      .successors();

    return successorsOfDirectDependents.length > 0
      ? traversalGraph
          .collection()
          .union(traversalGraph.$id(id))
          .union(successorsOfNode)
          .intersection(successorsOfDirectDependents)
      : renderGraph.elements();
  },
);

export const hideDependencies = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    id,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    id: string;
  }) => {
    const elementsToHide = traversalGraph.$id(id).successors();

    return renderGraph.elements().difference(elementsToHide);
  },
);

export const hide = withSerialization(
  ({
    traversalGraph,
    renderGraph,
    selector,
  }: {
    traversalGraph: Core;
    renderGraph: Core;
    selector: Filter;
  }) => {
    const elementsToHide = traversalGraph.collection();
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const matchingNodes = traversalGraph.nodes().filter(selector);
    const edgesForElements = matchingNodes.connectedEdges();

    elementsToHide.merge(matchingNodes).merge(edgesForElements);

    return renderGraph.elements().difference(elementsToHide);
  },
);
