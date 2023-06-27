import {
  Core,
  CollectionReturnValue,
  CollectionArgument,
  Selector,
  Singular,
} from 'cytoscape';
import { renderElementsToGraph } from './render-elements-to-graph';
import { DependencyType } from '@commonalityco/types';
import { OffloadRenderFn } from './get-updated-graph-json';

const ZOOM_FACTOR = 0.2;

type Filter =
  | Selector
  | ((ele: Singular, index: number, eles: CollectionArgument) => boolean);

interface RenderProps {
  onRender: (graph: Core) => void;
  onLoad: () => void;
  renderGraph: Core;
  traversalGraph: Core;
  theme: string;
  getUpdatedGraphJson: OffloadRenderFn;
}

interface SelectorProps extends RenderProps {
  selector: Filter;
}

interface IdProps extends RenderProps {
  id: string;
}

const getElementDefinitions = (collection: CollectionReturnValue) => {
  return collection.map((element) => {
    return {
      group: element.group(),
      data: element.data(),
    };
  });
};

const renderGraphElements = ({
  elements,
  ...props
}: RenderProps & { elements: CollectionReturnValue }) => {
  if (!props.traversalGraph || !props.renderGraph) return;

  renderElementsToGraph({
    ...props,
    elements: getElementDefinitions(elements),
  });
};

export const handleHideAll = (props: RenderProps) => {
  renderElementsToGraph({
    ...props,
    elements: getElementDefinitions(props.traversalGraph.collection()),
  });
};

export const handleHide = ({ selector, ...props }: SelectorProps) => {
  const elementsToHide = props.traversalGraph.collection();
  const nodesToHide = props.traversalGraph.filter(selector);
  const edgesForElements = nodesToHide.connectedEdges();

  elementsToHide.merge(nodesToHide).merge(edgesForElements);
  const elementsToRender = props.renderGraph
    .elements()
    .difference(elementsToHide);

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleShowAll = (props: RenderProps) => {
  renderGraphElements({
    ...props,
    elements: props.traversalGraph.elements(),
  });
};

export const handleShow = ({ selector, ...props }: SelectorProps) => {
  let nodesToRender = props.traversalGraph.collection();
  const matchingNodes = props.traversalGraph.filter(selector);

  nodesToRender = nodesToRender.union(matchingNodes);
  nodesToRender = nodesToRender.union(props.renderGraph.elements());

  const edgesToRender = nodesToRender.edgesTo(nodesToRender);
  const elementsToRender = nodesToRender.union(edgesToRender);

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleShowDependents = ({ id, ...props }: IdProps) => {
  const elementsToRender = props.traversalGraph
    .$id(id)
    .incomers()
    .union(props.renderGraph.elements());

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleHideDependents = ({ id, ...props }: IdProps) => {
  const elementsToHide = props.traversalGraph.$id(id).incomers();
  const elementsToRender = props.renderGraph
    .elements()
    .difference(elementsToHide);

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleShowDependencies = ({ id, ...props }: IdProps) => {
  const elementsToRender = props.traversalGraph
    .$id(id)
    .outgoers()
    .union(props.renderGraph.elements());

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleHideDependencies = ({ id, ...props }: IdProps) => {
  const elementsToHide = props.traversalGraph.$id(id).outgoers();
  const elementsToRender = props.renderGraph
    .elements()
    .difference(elementsToHide);

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleFocus = ({ selector, ...props }: SelectorProps) => {
  const elementsToRender = props.traversalGraph.filter(selector);

  renderGraphElements({
    ...props,
    elements: elementsToRender,
  });
};

export const handleZoomIn = ({ renderGraph }: { renderGraph: Core }) => {
  if (!renderGraph) return;

  const currentZoom = renderGraph.zoom();

  const newZoom = currentZoom + currentZoom * ZOOM_FACTOR;

  const x = renderGraph.width() / 2;
  const y = renderGraph.height() / 2;

  renderGraph.zoom({
    level: newZoom,
    position: { x, y },
  });
};

export const handleZoomOut = ({ renderGraph }: { renderGraph: Core }) => {
  if (!renderGraph) return;

  const currentZoom = renderGraph.zoom();

  const newZoom = currentZoom - currentZoom * ZOOM_FACTOR;

  const x = renderGraph.width() / 2;
  const y = renderGraph.height() / 2;

  renderGraph.zoom({
    level: newZoom,
    position: { x, y },
  });
};

interface FitProps extends RenderProps {
  selector?: string;
  padding?: number;
}

export const handleFit = ({ selector, padding, renderGraph }: FitProps) => {
  if (!renderGraph) return;

  const elements = selector
    ? renderGraph.elements(selector)
    : renderGraph.elements();

  renderGraph.fit(elements, padding);
};

const handleSetShowEdgeColor = (props: RenderProps & { isShown: boolean }) => {
  if (!props.renderGraph) return;

  props.renderGraph.scratch('forceEdgeColor', props.isShown);
  props.renderGraph.edges().forEach((edge) => {
    if (props.isShown) {
      const type = edge.data('type') as DependencyType;

      edge.addClass(type);
      edge.addClass('focus');
    } else {
      edge.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
      edge.removeClass('focus');
    }
  });
};

interface ThemeProps extends RenderProps {
  theme: string;
}

export const handleSetTheme = (props: ThemeProps) => {
  props.renderGraph.scratch('theme', props.theme);
  props.renderGraph
    .elements()
    .removeClass(['dark', 'light'])
    .addClass(props.theme);
};
