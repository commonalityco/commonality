import { DependencyType } from '@commonalityco/utils-core';
import { Core, EdgeSingular, EventObject } from 'cytoscape';

interface EventHandlerArgs {
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
}

/**********************************
 *            NODES               *
 **********************************/
export const handleNodeMouseover = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: EventObject['target'] }) => {
  const neighborhood = target.closedNeighborhood();

  renderGraph
    ?.elements()
    .difference(neighborhood)
    .filter((ele) => {
      return !ele.selected();
    })
    .addClass('dim');

  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  if (!forceEdgeColor) {
    target.connectedEdges().map((element: EdgeSingular) => {
      const type = element.data('type') as DependencyType;

      element.addClass(type);
    });
  }

  neighborhood.addClass('focus');
};

export const handleNodeMouseout = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: EventObject['target'] }) => {
  const neighborhood = target.neighborhood();
  const focusedElements = renderGraph.collection([neighborhood, target]);

  renderGraph?.elements().difference(focusedElements).removeClass('dim');

  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  if (!forceEdgeColor) {
    target.connectedEdges().map((element: EdgeSingular) => {
      element.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
    });
  }

  neighborhood
    .filter((element: EdgeSingular) => !element.selected())
    .removeClass('focus');
};

/**********************************
 *            EDGES               *
 **********************************/
export const handleEdgeMouseover = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: EdgeSingular }) => {
  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  if (forceEdgeColor) return;

  const type = target.data('type') as DependencyType;

  target.addClass(type);
  target.addClass('focus');
};

export const handleEdgeMouseout = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: EventObject['target'] }) => {
  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  if (forceEdgeColor) return;

  target.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
  target.removeClass('focus');
};

/**********************************
 *         GENERAL               *
 **********************************/

export const bindRenderGraphEvents = (args: EventHandlerArgs) => {
  const { renderGraph } = args;

  renderGraph
    .nodes()
    .on('mouseover', (event) =>
      handleNodeMouseover({ ...args, target: event.target })
    );
  renderGraph
    .nodes()
    .on('mouseout', (event) =>
      handleNodeMouseout({ ...args, target: event.target })
    );

  renderGraph
    .edges()
    .on('mouseover', (event) =>
      handleEdgeMouseover({ ...args, target: event.target })
    );
  renderGraph
    .edges()
    .on('mouseout', (event) =>
      handleEdgeMouseout({ ...args, target: event.target })
    );
};
