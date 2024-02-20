'use client';
import { useEffect, useState } from 'react';
import { useReactFlow, Edge, Node, useStoreApi } from '@xyflow/react';

function useLayout({
  direction = 'TB',
  getElements,
}: {
  direction?: 'TB' | 'LR';
  getElements: (options: {
    nodes: Node[];
    edges: Edge[];
    direction: 'TB' | 'LR';
  }) => Promise<{
    nodes: Node[];
    edges: Edge[];
  }>;
}): { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const { setNodes, setEdges, getViewport, setViewport, getNodes, getEdges } =
    useReactFlow();

  const storeApi = useStoreApi();

  useEffect(() => {
    storeApi.subscribe(async (state, prev) => {
      if (state === prev) return;

      if (state.nodes.length === prev.nodes.length) return;
      console.log('RECALCULATE');
      console.log('state:', state.nodes.length);
      console.log('prev:', prev.nodes.length);

      setIsLoading(true);

      const result = await getElements({
        nodes: getNodes(),
        edges: getEdges(),
        direction,
      });
      console.log('new nodes:', result.nodes.length);
      setNodes(result.nodes);
      setEdges(result.edges);
      setViewport(getViewport());

      setIsLoading(false);
    });
  }, []);

  return { isLoading };
}

export default useLayout;
