import { ThemeName } from 'hooks/useTheme';
import cytoscape, {
  Core,
  Collection,
  ElementDefinition,
  EdgeSingular,
  NodeSingular,
  CollectionReturnValue,
  CoreGraphManipulation,
} from 'cytoscape';
import { nodeStyles } from './styles/node';
import { edgeStyles } from './styles/edge';
import { layoutOptions } from './layoutOptions';
import reactDOMServer from 'react-dom/server';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import { menuStyles } from './styles/menuStyles';

export interface GraphManager {
  render: (collection: ElementDefinition[]) => void;
  init: (options: {
    elements: ElementDefinition[];
    onRender: (collection: CollectionReturnValue) => void;
  }) => void;
  fit(selector?: string, padding?: number): void;
  hideAll(): void;
  showAll(): void;
  show: (...opts: Parameters<CoreGraphManipulation['filter']>) => void;
  hide: (...opts: Parameters<CoreGraphManipulation['filter']>) => void;
  focus: (...opts: Parameters<CoreGraphManipulation['filter']>) => void;
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
  debugger;
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

  const bindNodeEventHandlers = (graph: Core) => {
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
  };

  const bindEdgeEventHandlers = (graph: Core) => {
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
  };

  const render = (elements: ElementDefinition[]) => {
    if (!_renderGraph) {
      _renderGraph = cytoscape({
        container,
        style: [...nodeStyles, ...edgeStyles, ...menuStyles],
        panningEnabled: true,
        layout: layoutOptions,
        autoungrabify: true,
        motionBlur: true,
        elements,
      });
    } else {
      const collection = _renderGraph.collection().union(elements);

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
          edge.source().renderedPosition().x -
          edge.target().renderedPosition().x;

        const decreaseFactor = -0.2;
        const controlPointDistance = edgeVerticalLength * decreaseFactor;
        const controlPointDistances = [
          controlPointDistance,
          -1 * controlPointDistance,
        ];
        edge.data('controlPointDistances', controlPointDistances.join(' '));
      };

      _renderGraph.edges().forEach((edge) => adjustEdgeCurve(edge));
      _renderGraph.endBatch();

      bindNodeEventHandlers(_renderGraph);
      bindEdgeEventHandlers(_renderGraph);

      _onRender(_renderGraph.elements());
    }

    _renderGraph.ready(() => {
      if (!_renderGraph) return;

      bindNodeEventHandlers(_renderGraph);
      bindEdgeEventHandlers(_renderGraph);

      _renderGraph.mount(container);

      _onRender(_renderGraph.elements());
    });

    console.log('render');
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
    _renderGraph.endBatch();

    bindNodeEventHandlers(_renderGraph);
    bindEdgeEventHandlers(_renderGraph);

    _onRender(_renderGraph.elements());
  };

  const hideAll: GraphManager['hideAll'] = () => {
    if (!_traversalGraph) return;
    update(_traversalGraph.collection());
    console.log('hide all');
  };

  const hide: GraphManager['hide'] = (selector) => {
    if (!_traversalGraph || !_renderGraph) return;

    const elementsToHide = _traversalGraph.collection();
    const nodesToHide = _traversalGraph.filter(selector);

    const edgesForElements = nodesToHide.connectedEdges();

    elementsToHide.merge(nodesToHide).merge(edgesForElements);

    const elementsToRender = _renderGraph.elements().difference(elementsToHide);

    update(elementsToRender);
  };

  const showAll: GraphManager['showAll'] = () => {
    if (!_traversalGraph) return;

    update(_traversalGraph.elements());
    console.log('show all');
  };

  const show: GraphManager['show'] = (selector) => {
    if (!_traversalGraph || !_renderGraph) return;

    let nodesToRender = _traversalGraph.collection();

    const matchingNodes = _traversalGraph.filter(selector);

    nodesToRender = nodesToRender.union(matchingNodes);

    nodesToRender = nodesToRender.union(_renderGraph.elements());

    const edgesToRender = nodesToRender.edgesTo(nodesToRender);

    const elementsToRender = nodesToRender.union(edgesToRender);

    update(elementsToRender);
  };

  const focus: GraphManager['focus'] = (selector) => {
    if (!_traversalGraph) return;

    const matchingNodes = _traversalGraph.filter(selector);

    const neighborhood = matchingNodes.closedNeighborhood();

    update(neighborhood);

    console.log('focus');
  };

  const init: GraphManager['init'] = ({ elements, onRender }) => {
    if (_traversalGraph) return;

    if (_renderGraph) {
      _renderGraph.destroy();
      _renderGraph = undefined;
    }

    _onRender = onRender;
    _traversalGraph = cytoscape({
      headless: true,
      elements,
    });

    render(elements);

    console.log('init');
  };

  const fit: GraphManager['fit'] = (selector, padding) => {
    if (!_renderGraph) return;

    const elements = selector
      ? _renderGraph.elements(selector)
      : _renderGraph.elements();
    console.log({ fittingEls: elements });

    _renderGraph.fit(elements, padding);
  };

  return { render, showAll, hideAll, init, fit, focus, show, hide };
};
