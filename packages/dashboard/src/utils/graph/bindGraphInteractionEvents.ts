import { ThemeName } from 'constants/ThemeName';
import { Core, CollectionReturnValue } from 'cytoscape';
import { graphEvents } from 'utils/graph/graphEvents';
import { renderElementsToGraph } from 'utils/graph/renderElementsToGraph';
import { logger } from 'utils/logger';

const ZOOM_FACTOR = 0.2;

const getElementDefinitions = (collection: CollectionReturnValue) => {
  return collection.map((element) => {
    return {
      group: element.group(), // 'nodes' or 'edges'
      data: element.data(), // Data attributes of the element
      // Include any other properties you need
    };
  });
};

export const bindGraphInteractionEvents = ({
  renderGraph,
  traversalGraph,
  theme,
  onRender,
}: {
  onRender?: (graph: Core) => void;
  renderGraph: Core;
  traversalGraph: Core;
  theme: ThemeName;
}) => {
  graphEvents.on('HideAll', () => {
    if (!traversalGraph) return;

    logger.info({ event: 'HideAll' });

    renderElementsToGraph({
      onRender,
      theme,
      elements: getElementDefinitions(traversalGraph.collection()),
      renderGraph,
    });
  });

  graphEvents.on('Hide', ({ selector }) => {
    if (!traversalGraph || !renderGraph) return;

    logger.info({ event: 'Hide', options: { selector } });

    const elementsToHide = traversalGraph.collection();
    const nodesToHide = traversalGraph.filter(selector);

    const edgesForElements = nodesToHide.connectedEdges();

    elementsToHide.merge(nodesToHide).merge(edgesForElements);

    const elementsToRender = renderGraph.elements().difference(elementsToHide);

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('Isolate', ({ id }) => {
    if (!traversalGraph) return;

    logger.info({ event: 'Isolate' });

    const elementsToRender = traversalGraph.$id(id);

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('ShowAll', () => {
    if (!traversalGraph) return;

    logger.info({ event: 'ShowAll' });

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(traversalGraph.elements()),
    });
  });

  graphEvents.on('Show', ({ selector }) => {
    if (!traversalGraph || !renderGraph) return;
    logger.info({ event: 'Show', options: { selector } });

    let nodesToRender = traversalGraph.collection();

    const matchingNodes = traversalGraph.filter(selector);

    nodesToRender = nodesToRender.union(matchingNodes);

    nodesToRender = nodesToRender.union(renderGraph.elements());

    const edgesToRender = nodesToRender.edgesTo(nodesToRender);

    const elementsToRender = nodesToRender.union(edgesToRender);

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('ShowDependents', ({ id }) => {
    if (!traversalGraph || !renderGraph) return;

    logger.info({ event: 'ShowDependencies', options: { id } });

    const elementsToRender = traversalGraph
      .$id(id)
      .incomers()
      .union(renderGraph.elements());

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('HideDependents', ({ id }) => {
    if (!traversalGraph || !renderGraph) return;

    logger.info({ event: 'ShowDependencies', options: { id } });

    const elementsToHide = traversalGraph.$id(id).incomers();
    const elementsToRender = renderGraph.elements().difference(elementsToHide);

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('ShowDependencies', ({ id }) => {
    if (!traversalGraph || !renderGraph) return;

    logger.info({ event: 'ShowDependencies', options: { id } });

    const elementsToRender = traversalGraph
      .$id(id)
      .outgoers()
      .union(renderGraph.elements());

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('HideDependencies', ({ id }) => {
    if (!traversalGraph || !renderGraph) return;

    logger.info({ event: 'ShowDependencies', options: { id } });

    const elementsToHide = traversalGraph.$id(id).outgoers();
    const elementsToRender = renderGraph.elements().difference(elementsToHide);

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(elementsToRender),
    });
  });

  graphEvents.on('Focus', ({ selector }) => {
    if (!traversalGraph) return;

    logger.info({ event: 'Focus', options: { selector } });

    const matchingNodes = traversalGraph.filter(selector);

    const neighborhood = matchingNodes.closedNeighborhood();

    renderElementsToGraph({
      onRender,
      renderGraph,
      theme,
      elements: getElementDefinitions(neighborhood),
    });
  });

  graphEvents.on('ZoomIn', () => {
    if (!renderGraph) return;

    logger.info({ event: 'ZoomIn' });

    const currentZoom = renderGraph.zoom();

    const newZoom = currentZoom + currentZoom * ZOOM_FACTOR;

    const x = renderGraph.width() / 2;
    const y = renderGraph.height() / 2;

    renderGraph.zoom({
      level: newZoom,
      position: { x, y },
    });
  });

  graphEvents.on('ZoomOut', () => {
    if (!renderGraph) return;

    logger.info({ event: 'ZoomOut' });

    const currentZoom = renderGraph.zoom();

    const newZoom = currentZoom - currentZoom * ZOOM_FACTOR;

    const x = renderGraph.width() / 2;
    const y = renderGraph.height() / 2;

    renderGraph.zoom({
      level: newZoom,
      position: { x, y },
    });
  });

  graphEvents.on('Fit', ({ selector, padding }) => {
    if (!renderGraph) return;

    logger.info({ event: 'Fit', options: { selector, padding } });

    const elements = selector
      ? renderGraph.elements(selector)
      : renderGraph.elements();

    renderGraph.fit(elements, padding);
  });
};
