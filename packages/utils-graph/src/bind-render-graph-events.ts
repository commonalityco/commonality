import { ConstraintResult } from '@commonalityco/types';
import type { Core, EdgeSingular, EventObject, NodeSingular } from 'cytoscape';

interface EventHandlerArguments {
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
  results: ConstraintResult[];
}

/**********************************
 *            NODES               *
 **********************************/
export const handleNodeMouseover = ({
  target,
  renderGraph,
}: EventHandlerArguments & { target: NodeSingular }) => {
  const neighborhood = target.closedNeighborhood();

  renderGraph.elements().addClass('dim');

  neighborhood.removeClass('dim');
  target.removeClass('dim');
  neighborhood.addClass('focus');
  target.addClass('focus');

  target.addClass('hover');
};

export const handleNodeMouseout = ({
  target,
  renderGraph,
}: EventHandlerArguments & { target: NodeSingular }) => {
  const neighborhood = target.neighborhood();
  const focusedElements = renderGraph.collection([neighborhood, target]);

  renderGraph.elements().removeClass(['dim', 'focus', 'hover']);
  focusedElements.removeClass('focus');
  target.removeClass('hover');
};

/**********************************
 *            EDGES               *
 **********************************/
export const handleEdgeMouseover = ({
  target,
}: EventHandlerArguments & { target: EdgeSingular }) => {
  target.addClass('hover');
};

export const handleEdgeMouseout = ({
  target,
}: EventHandlerArguments & { target: EventObject['target'] }) => {
  target.removeClass('hover');
};

/**********************************
 *         GENERAL               *
 **********************************/

export const bindRenderGraphEvents = (arguments_: EventHandlerArguments) => {
  const { renderGraph } = arguments_;

  renderGraph
    .nodes()
    .on('mouseover', (event) =>
      handleNodeMouseover({ ...arguments_, target: event.target }),
    );
  renderGraph
    .nodes()
    .on('mouseout', (event) =>
      handleNodeMouseout({ ...arguments_, target: event.target }),
    );

  renderGraph
    .edges()
    .on('mouseover', (event) =>
      handleEdgeMouseover({ ...arguments_, target: event.target }),
    );
  renderGraph
    .edges()
    .on('mouseout', (event) =>
      handleEdgeMouseout({ ...arguments_, target: event.target }),
    );
};
