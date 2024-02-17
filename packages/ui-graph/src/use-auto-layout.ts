import { useEffect } from 'react';
import {
  type Node,
  type Edge,
  useReactFlow,
  useNodesInitialized,
  useStore,
} from 'reactflow';
8;
import { getSourceHandlePosition, getTargetHandlePosition } from './utils';
import { dagreLayout } from './dagre';
import { LayoutAlgorithmOptions } from './types';

function useAutoLayout(options: LayoutAlgorithmOptions) {
  const { setNodes, setEdges, fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  // Here we are storing a map of the nodes and edges in the flow. By using a
  // custom equality function as the second argument to `useStore`, we can make
  // sure the layout algorithm only runs when something has changed that should
  // actually trigger a layout change.
  const elements = useStore(
    (state) => ({
      nodeMap: state.nodeInternals,
      // eslint-disable-next-line unicorn/no-array-reduce
      edgeMap: state.edges.reduce(
        (acc, edge) => acc.set(edge.id, edge),
        new Map(),
      ),
    }),
    // The compare elements function will only update `elements` if something has
    // changed that should trigger a layout. This includes changes to a node's
    // dimensions, the number of nodes, or changes to edge sources/targets.
    compareElements,
  );

  useEffect(() => {
    // Only run the layout if there are nodes and they have been initialized with
    // their dimensions
    if (!nodesInitialized || elements.nodeMap.size === 0) {
      return;
    }

    // The callback passed to `useEffect` cannot be `async` itself, so instead we
    // create an async function here and call it immediately afterwards.
    const runLayout = async () => {
      const layoutAlgorithm = dagreLayout;
      const nodes = [...elements.nodeMap.values()];
      const edges = [...elements.edgeMap.values()];

      const { nodes: nextNodes, edges: nextEdges } = await layoutAlgorithm(
        nodes,
        edges,
        options,
      );

      // Mutating the nodes and edges directly here is fine because we expect our
      // layouting algorithms to return a new array of nodes/edges.
      for (const node of nextNodes) {
        node.style = { ...node.style, opacity: 1 };
        node.sourcePosition = getSourceHandlePosition(options.direction);
        node.targetPosition = getTargetHandlePosition(options.direction);
      }

      for (const edge of edges) {
        edge.style = { ...edge.style, opacity: 1 };
      }

      setNodes(nextNodes);
      setEdges(nextEdges);
    };

    runLayout();
    fitView();
  }, [nodesInitialized, elements, setNodes, setEdges]);
}

export default useAutoLayout;

type Elements = {
  nodeMap: Map<string, Node>;
  edgeMap: Map<string, Edge>;
};

function compareElements(xs: Elements, ys: Elements) {
  const isEqual =
    compareNodes(xs.nodeMap, ys.nodeMap) &&
    compareEdges(xs.edgeMap, ys.edgeMap);

  console.log({ isEqual });
  return isEqual;
}

function compareNodes(xs: Map<string, Node>, ys: Map<string, Node>) {
  // the number of nodes changed, so we already know that the nodes are not equal
  if (xs.size !== ys.size) return false;

  for (const [id, x] of xs.entries()) {
    const y = ys.get(id);

    // the node doesn't exist in the next state so it just got added
    if (!y) return false;
    // We don't want to force a layout change while a user might be resizing a
    // node, so we only compare the dimensions if the node is not currently
    // being resized.
    //
    // We early return here instead of using a `continue` because there's no
    // scenario where we'd want nodes to start moving around *while* a user is
    // trying to resize a node or move it around.
    if (x.resizing || x.dragging) return true;
    if (x.width !== y.width || x.height !== y.height) return false;
  }

  return true;
}

function compareEdges(xs: Map<string, Edge>, ys: Map<string, Edge>) {
  // the number of edges changed, so we already know that the edges are not equal
  if (xs.size !== ys.size) return false;

  for (const [id, x] of xs.entries()) {
    const y = ys.get(id);

    // the edge doesn't exist in the next state so it just got added
    if (!y) return false;
    if (x.source !== y.source || x.target !== y.target) return false;
    if (x?.sourceHandle !== y?.sourceHandle) return false;
    if (x?.targetHandle !== y?.targetHandle) return false;
  }

  return true;
}
