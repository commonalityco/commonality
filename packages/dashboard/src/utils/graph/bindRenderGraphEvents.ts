import { Dependency, DependencyType, Package } from '@commonalityco/types';
import { ThemeName } from 'constants/ThemeName';
import { Core, EdgeSingular, EventObject, NodeSingular } from 'cytoscape';
import { graphEvents } from 'utils/graph/graphEvents';

const darkLineColors = {
  default: '#d4d4d8',
  [DependencyType.PRODUCTION]: '#FFD166',
  [DependencyType.DEVELOPMENT]: '#FFD166',
  [DependencyType.PEER]: '#FFD166',
} as const;

const lightLineColors = {
  default: '#d4d4d8',
  [DependencyType.PRODUCTION]: '#10b981',
  [DependencyType.DEVELOPMENT]: '#0ea5e9',
  [DependencyType.PEER]: '#8b5cf6',
} as const;

/**
 * Binds event handlers to the render graph to handle node and edge interactions.
 * @param renderGraph - The render graph to bind event handlers to.
 */
export const bindRenderGraphEvents = ({
  renderGraph,
  theme,
}: {
  renderGraph: Core;
  theme: ThemeName;
}) => {
  /**********************************
   *            NODES               *
   **********************************/
  const handleNodeMouseover = (event: EventObject) => {
    const target: NodeSingular = event.target;
    const neighborhood = target.closedNeighborhood();

    renderGraph
      ?.elements()
      .difference(neighborhood)
      .filter((ele) => {
        return !ele.selected();
      })
      .addClass('dim');

    target.connectedEdges().map((el) => {
      const type = el.data('type') as DependencyType;
      const color =
        theme === ThemeName.Dark ? darkLineColors[type] : lightLineColors[type];

      el.style({
        'line-color': color,
        'target-arrow-color': color,
      });
    });

    neighborhood.addClass('focus');
  };

  const handleNodeMouseout = (event: EventObject) => {
    const target: NodeSingular = event.target;
    const neighborhood = target.neighborhood();
    const focusedElements = renderGraph.collection([neighborhood, target]);

    renderGraph?.elements().difference(focusedElements).removeClass('dim');

    target.connectedEdges().map((el) => {
      const color =
        theme === ThemeName.Dark
          ? darkLineColors.default
          : lightLineColors.default;

      el.style({
        'line-color': color,
        'target-arrow-color': color,
      });
    });

    neighborhood.filter((el) => !el.selected()).removeClass('focus');
  };

  const handleNodeSelect = (event: EventObject) => {
    const target: NodeSingular = event.target;
    const data: Package = target.data();

    graphEvents.emit('PackageClick', {
      data,
      element: target,
      ref: target.popperRef(),
    });
  };

  renderGraph.nodes().on('mouseover', handleNodeMouseover);
  renderGraph.nodes().on('mouseout', handleNodeMouseout);
  renderGraph.nodes().on('select', handleNodeSelect);

  /**********************************
   *            EDGES               *
   **********************************/
  const handleEdgeMouseover = (event: EventObject) => {
    const target: EdgeSingular = event.target;
    const type = target.data('type') as DependencyType;
    const color =
      theme === ThemeName.Dark ? darkLineColors[type] : lightLineColors[type];

    target.style({
      'line-color': color,
      'target-arrow-color': color,
      'overlay-color': color,
    });
    target.addClass('focus');
  };

  const handleEdgeMouseout = (event: EventObject) => {
    const target: EdgeSingular = event.target;

    const color =
      theme === ThemeName.Dark
        ? darkLineColors.default
        : lightLineColors.default;

    target.style({
      'line-color': color,
      'target-arrow-color': color,
    });

    target.removeClass('focus');
  };

  const handleEdgeSelect = (event: EventObject) => {
    const target: NodeSingular = event.target;
    const data: Dependency & { target: string; source: string } = target.data();

    graphEvents.emit('DependencyClick', {
      data,
      element: target,
      ref: target.popperRef(),
    });
  };

  renderGraph.edges().on('mouseover', handleEdgeMouseover);
  renderGraph.edges().on('mouseout', handleEdgeMouseout);
  renderGraph.edges().on('select', handleEdgeSelect);

  /**********************************
   *            GENERAL               *
   **********************************/

  /**
   * Handles graph move events triggered by pan, zoom, or resize.
   */
  const handleMove = () => {
    graphEvents.emit('Move');
  };

  renderGraph.on('pan zoom resize', handleMove);
};
