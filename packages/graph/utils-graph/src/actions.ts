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

type GraphActionFn<Args> = (args: Args) => CollectionArgument;
function withSerialization<Args>(fn: GraphActionFn<Args>) {
  return (args: Args): ElementDefinition[] => {
    const result = fn(args);

    return result.jsons() as any;
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
    const matchingNodes = traversalGraph.nodes().filter(selector);
    const existingNodes = renderGraph.nodes();
    const nodesToRender = existingNodes.union(matchingNodes);
    const edgesToRender = nodesToRender.nodes().edgesTo(nodesToRender.nodes());
    const elementsToRender = nodesToRender.union(edgesToRender);

    return elementsToRender;
  }
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
  }
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
  }
);

export const setInitialElements = withSerialization(
  ({ renderGraph }: { renderGraph: Core }) => {
    return renderGraph.elements();
  }
);

export const focus = withSerialization(
  ({
    traversalGraph,
    selector,
  }: {
    traversalGraph: Core;
    selector: Filter;
  }) => {
    const nodesToRender = traversalGraph.nodes().filter(selector);
    const edgesToRender = nodesToRender.edgesTo(nodesToRender);

    return traversalGraph
      .collection()
      .union(nodesToRender)
      .union(edgesToRender);
  }
);

export const showAll = withSerialization(
  ({ traversalGraph }: { traversalGraph: Core }) => {
    return traversalGraph.elements();
  }
);

export const hideAll = withSerialization(
  ({ traversalGraph }: { traversalGraph: Core }) => {
    return traversalGraph.collection();
  }
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

    if (successorsOfDirectDependents.length) {
      return traversalGraph
        .collection()
        .union(traversalGraph.$id(id))
        .union(successorsOfNode)
        .intersection(successorsOfDirectDependents);
    } else {
      return renderGraph.elements();
    }
  }
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
  }
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
    const nodesToHide = traversalGraph.nodes().filter(selector);
    const edgesForElements = nodesToHide.connectedEdges();

    elementsToHide.merge(nodesToHide).merge(edgesForElements);

    return renderGraph.elements().difference(elementsToHide);
  }
);
