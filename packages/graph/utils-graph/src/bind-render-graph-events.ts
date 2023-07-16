import { Violation } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { Core, EdgeSingular, EventObject, NodeSingular } from 'cytoscape';

interface EventHandlerArgs {
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
  violations: Violation[];
}

/**********************************
 *            NODES               *
 **********************************/
export const handleNodeMouseover = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: NodeSingular }) => {
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

  target.addClass('hover');
};

export const handleNodeMouseout = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: NodeSingular }) => {
  const neighborhood = target.neighborhood();
  const focusedElements = renderGraph.collection([neighborhood, target]);

  renderGraph?.elements().difference(focusedElements).removeClass('dim');

  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  if (!forceEdgeColor) {
    target.connectedEdges().map((element: EdgeSingular) => {
      element.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
    });
  }

  target.removeClass('hover');
};

/**********************************
 *            EDGES               *
 **********************************/
export const handleEdgeMouseover = ({
  target,
  renderGraph,
  violations = [],
}: EventHandlerArgs & { target: EdgeSingular }) => {
  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  target.addClass('hover');

  if (forceEdgeColor) return;

  const type = target.data('type') as DependencyType;

  const sourcePackageName = target.source().id();
  const targetPackageName = target.target().id();
  const hasViolation = violations.some((violation) => {
    return (
      violation.sourcePackageName === sourcePackageName &&
      violation.targetPackageName === targetPackageName
    );
  });

  if (!hasViolation) {
    target.addClass(type);
  }
};

export const handleEdgeMouseout = ({
  target,
  renderGraph,
}: EventHandlerArgs & { target: EventObject['target'] }) => {
  const forceEdgeColor = renderGraph.scratch('forceEdgeColor');

  target.removeClass('hover');

  if (forceEdgeColor) return;

  target.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
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
