import { ThemeName } from 'hooks/useTheme';
import cytoscape, {
  Core,
  Collection,
  ElementDefinition,
  EdgeSingular,
  NodeSingular,
  CollectionReturnValue,
} from 'cytoscape';
import { nodeStyles } from './styles/node';
import { edgeStyles } from './styles/edge';
import { layoutOptions } from './layoutOptions';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import { menuStyles } from './styles/menuStyles';
import { graphEvents } from './graphEvents';
import { Dependency, Package } from '@commonalityco/types';
import { logger } from 'utils/logger';
import pino from 'pino';

export interface GraphManager {
  render: (collection: ElementDefinition[]) => void;
  init: (options: {
    elements: ElementDefinition[];
    onRender: (collection: CollectionReturnValue) => void;
  }) => void;
}

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const ZOOM_FACTOR = 0.2;

const graphLogger = pino({ name: 'GraphManager' });

function withTiming<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const startTime = new Date().getTime();
    const result = fn(...args);
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000;

    graphLogger.log({ seconds: duration.toFixed(2) }, `${name} executed`);

    return result;
  };
}

export const createGraphManager = ({
  container,
}: {
  container: HTMLElement;
}): GraphManager => {
  let _renderGraph: Core | undefined;
  let _traversalGraph: Core | undefined;

  const isDarkOs =
    window.matchMedia && window.matchMedia(THEME_MEDIA_QUERY).matches;

  let _theme = isDarkOs ? ThemeName.Dark : ThemeName.Light;
  let _onRender: (collection: CollectionReturnValue) => void;

  window.matchMedia(THEME_MEDIA_QUERY).addEventListener('change', (event) => {
    _theme = event.matches ? ThemeName.Dark : ThemeName.Light;

    if (!_renderGraph) return;

    if (_theme === ThemeName.Dark) {
      _renderGraph.elements().addClass('dark');
    } else {
      _renderGraph.elements().removeClass('dark');
    }
  });

  cytoscape.use(dagre);
  cytoscape.use(popper);

  const bindGraphEventHandlers = (graph: Core) => {
    const bindNodeEventHandlers = () => {
      graph.nodes().removeListener('mouseover');
      graph.nodes().on('mouseover', (event) => {
        if (!_renderGraph) return;

        const target: NodeSingular = event.target;
        const neighborhood = target.closedNeighborhood();

        _renderGraph
          ?.elements()
          .difference(neighborhood)
          .filter((ele) => {
            return !ele.selected();
          })
          .addClass('dim');

        neighborhood.addClass('focus');
      });

      graph.nodes().removeListener('mouseout');
      graph.nodes().on('mouseout', (event) => {
        const target: NodeSingular = event.target;
        if (!_renderGraph) return;

        const neighborhood = target.neighborhood();

        const focusedElements = _renderGraph.collection([neighborhood, target]);

        _renderGraph?.elements().difference(focusedElements).removeClass('dim');

        neighborhood.filter((el) => !el.selected()).removeClass('focus');
      });

      graph.nodes().removeListener('select');
      graph.nodes().on('select', (event) => {
        if (!_renderGraph) return;
        const target: NodeSingular = event.target;
        const data: Package = target.data();

        graphEvents.emit('PackageClick', {
          data,
          element: target,
          ref: target.popperRef(),
        });
      });
    };

    const bindEdgeEventHandlers = () => {
      graph.edges().removeAllListeners();

      graph.edges().removeListener('mouseover');
      graph.edges().on('mouseover', (event) => {
        if (!_renderGraph) return;

        const target: EdgeSingular = event.target;

        target.addClass('focus');
      });

      graph.edges().removeListener('mouseout');
      graph.edges().on('mouseout', (event) => {
        if (!_renderGraph) return;

        const target: EdgeSingular = event.target;

        target.removeClass('focus');
      });

      graph.edges().removeListener('select');
      graph.edges().on('select', (event) => {
        if (!_renderGraph) return;
        const target: NodeSingular = event.target;
        const data: Dependency & { target: string; source: string } =
          target.data();

        graphEvents.emit('DependencyClick', {
          data,
          element: target,
          ref: target.popperRef(),
        });
      });
    };

    const bindGraphEventHandlers = () => {
      if (!_renderGraph) return;

      graph.edges().removeListener('pan zoom resize');
      graph.on('pan zoom resize', () => {
        graphEvents.emit('Move');
      });
    };

    bindNodeEventHandlers();
    bindEdgeEventHandlers();
    bindGraphEventHandlers();
  };

  const render = withTiming('render', (elements: ElementDefinition[]) => {
    if (_renderGraph) {
      _renderGraph.destroy();
      _renderGraph = undefined;
    }

    _renderGraph = cytoscape({
      container,
      style: [...nodeStyles, ...edgeStyles, ...menuStyles],
      panningEnabled: true,
      layout: layoutOptions,
      autoungrabify: true,
      motionBlur: true,
      elements,
    });

    if (_theme === ThemeName.Dark) {
      _renderGraph.elements().addClass('dark');
    } else {
      _renderGraph.elements().removeClass('dark');
    }

    _renderGraph.nodes().forEach((node) => {
      // createCustomLabel(container, node, renderNode);
    });

    _renderGraph.ready(() => {
      if (!_renderGraph) return;

      bindGraphEventHandlers(_renderGraph);

      _renderGraph.mount(container);
      _renderGraph.endBatch();
      _onRender(_renderGraph.elements());
    });
  });

  const update = withTiming('update', (collection: Collection) => {
    if (!_renderGraph) return;
    _renderGraph.startBatch();
    _renderGraph.elements().remove();
    _renderGraph.endBatch();

    _renderGraph.add(collection);

    _renderGraph.style([...nodeStyles, ...edgeStyles, ...menuStyles]);
    _renderGraph.layout(layoutOptions).run();

    _renderGraph.fit(undefined, 24).resize();

    if (_theme === ThemeName.Dark) {
      _renderGraph.elements().addClass('dark');
    } else {
      _renderGraph.elements().removeClass('dark');
    }

    let adjustEdgeCurve = function (edge: EdgeSingular) {
      const edgeVerticalLength =
        edge.source().renderedPosition().x - edge.target().renderedPosition().x;

      const decreaseFactor = -0.2;
      const controlPointDistance = edgeVerticalLength * decreaseFactor;
      const controlPointDistances = [
        controlPointDistance,
        -1 * controlPointDistance,
      ];
      edge.data('controlPointDistances', controlPointDistances.join(' '));
    };

    _renderGraph.edges().forEach((edge) => adjustEdgeCurve(edge));

    bindGraphEventHandlers(_renderGraph);

    _onRender(_renderGraph.elements());
  });

  graphEvents.removeAllListeners();
  graphEvents.on('HideAll', () => {
    if (!_traversalGraph) return;

    graphLogger.info({ event: 'HideAll' });

    update(_traversalGraph.collection());
  });

  graphEvents.on('Hide', ({ selector }) => {
    if (!_traversalGraph || !_renderGraph) return;

    graphLogger.info({ event: 'Hide', options: { selector } });

    const elementsToHide = _traversalGraph.collection();
    const nodesToHide = _traversalGraph.filter(selector);

    const edgesForElements = nodesToHide.connectedEdges();

    elementsToHide.merge(nodesToHide).merge(edgesForElements);

    const elementsToRender = _renderGraph.elements().difference(elementsToHide);

    update(elementsToRender);
  });

  graphEvents.on('ShowAll', () => {
    if (!_traversalGraph) return;

    graphLogger.info({ event: 'ShowAll' });

    update(_traversalGraph.elements());
  });

  graphEvents.on('Show', ({ selector }) => {
    if (!_traversalGraph || !_renderGraph) return;
    graphLogger.info({ event: 'Show', options: { selector } });

    let nodesToRender = _traversalGraph.collection();

    const matchingNodes = _traversalGraph.filter(selector);

    nodesToRender = nodesToRender.union(matchingNodes);

    nodesToRender = nodesToRender.union(_renderGraph.elements());

    const edgesToRender = nodesToRender.edgesTo(nodesToRender);

    const elementsToRender = nodesToRender.union(edgesToRender);

    update(elementsToRender);
  });

  graphEvents.on('Focus', ({ selector }) => {
    if (!_traversalGraph) return;

    graphLogger.info({ event: 'Focus', options: { selector } });

    const matchingNodes = _traversalGraph.filter(selector);

    const neighborhood = matchingNodes.closedNeighborhood();

    update(neighborhood);
  });

  graphEvents.on('ZoomIn', () => {
    if (!_renderGraph) return;

    graphLogger.info({ event: 'ZoomIn' });

    const currentZoom = _renderGraph.zoom();

    const newZoom = currentZoom + currentZoom * ZOOM_FACTOR;

    const x = _renderGraph.width() / 2;
    const y = _renderGraph.height() / 2;

    _renderGraph.zoom({
      level: newZoom,
      position: { x, y },
    });
  });

  graphEvents.on('ZoomOut', () => {
    if (!_renderGraph) return;

    graphLogger.info({ event: 'ZoomOut' });

    const currentZoom = _renderGraph.zoom();

    const newZoom = currentZoom - currentZoom * ZOOM_FACTOR;

    const x = _renderGraph.width() / 2;
    const y = _renderGraph.height() / 2;

    _renderGraph.zoom({
      level: newZoom,
      position: { x, y },
    });
  });

  graphEvents.on('Fit', ({ selector, padding }) => {
    if (!_renderGraph) return;

    graphLogger.info({ event: 'Fit', options: { selector, padding } });

    const elements = selector
      ? _renderGraph.elements(selector)
      : _renderGraph.elements();

    _renderGraph.fit(elements, padding);
  });

  const init: GraphManager['init'] = ({ elements, onRender }) => {
    if (_traversalGraph) {
      _traversalGraph.destroy();
      _traversalGraph = undefined;
    }

    _onRender = onRender;

    _traversalGraph = cytoscape({
      headless: true,
      elements,
    });

    render(elements);
  };

  return { render, init };
};
