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

export interface GraphManager {
  render: (collection: ElementDefinition[]) => void;
  init: (options: {
    elements: ElementDefinition[];
    onRender: (collection: CollectionReturnValue) => void;
  }) => void;
}

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

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

        _renderGraph?.elements().difference(neighborhood).addClass('dim');
        neighborhood.addClass('focus');
      });

      graph.nodes().removeListener('mouseout');
      graph.nodes().on('mouseout', (event) => {
        const target: NodeSingular = event.target;
        if (!_renderGraph) return;

        const neighborhood = target.neighborhood();

        const focusedElements = _renderGraph.collection([neighborhood, target]);

        _renderGraph?.elements().difference(focusedElements).removeClass('dim');
        neighborhood.removeClass('focus');
      });

      graph.nodes().on('click', (event) => {
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

      graph.edges().on('click', (event) => {
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

      graph.on('pan zoom resize', () => {
        graphEvents.emit('Move');
      });
    };

    bindNodeEventHandlers();
    bindEdgeEventHandlers();
    bindGraphEventHandlers();
  };

  const render = (elements: ElementDefinition[]) => {
    if (_renderGraph) {
      _renderGraph.destroy();
      _renderGraph = undefined;
    }

    _renderGraph = cytoscape({
      container,
      wheelSensitivity: 0.25,
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

    _renderGraph.ready(() => {
      if (!_renderGraph) return;

      bindGraphEventHandlers(_renderGraph);

      _renderGraph.mount(container);

      _onRender(_renderGraph.elements());
    });
  };

  const update = (collection: Collection) => {
    if (!_renderGraph) return;

    _renderGraph.startBatch();

    _renderGraph.elements().remove();

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

    _renderGraph.endBatch();
    _onRender(_renderGraph.elements());
  };

  graphEvents.on('HideAll', () => {
    if (!_traversalGraph) return;

    update(_traversalGraph.collection());
  });

  graphEvents.on('Hide', ({ selector }) => {
    if (!_traversalGraph || !_renderGraph) return;

    const elementsToHide = _traversalGraph.collection();
    const nodesToHide = _traversalGraph.filter(selector);

    const edgesForElements = nodesToHide.connectedEdges();

    elementsToHide.merge(nodesToHide).merge(edgesForElements);

    const elementsToRender = _renderGraph.elements().difference(elementsToHide);

    update(elementsToRender);
  });

  graphEvents.on('ShowAll', () => {
    if (!_traversalGraph) return;

    update(_traversalGraph.elements());
  });

  graphEvents.on('Show', ({ selector }) => {
    if (!_traversalGraph || !_renderGraph) return;

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

    const matchingNodes = _traversalGraph.filter(selector);

    const neighborhood = matchingNodes.closedNeighborhood();

    update(neighborhood);
  });

  graphEvents.on('Fit', ({ selector, padding }) => {
    if (!_renderGraph) return;

    const elements = selector
      ? _renderGraph.elements(selector)
      : _renderGraph.elements();

    _renderGraph.fit(elements, padding);
  });

  const init: GraphManager['init'] = ({ elements, onRender }) => {
    if (_traversalGraph) return;

    _onRender = onRender;
    _traversalGraph = cytoscape({
      headless: true,
      elements,
    });

    render(elements);
  };

  return { render, init };
};
