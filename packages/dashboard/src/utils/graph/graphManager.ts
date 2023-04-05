import { ThemeName } from 'hooks/useTheme';
import cytoscape, {
  Core,
  ElementDefinition,
  CollectionReturnValue,
} from 'cytoscape';
import popper from 'cytoscape-popper';
import { graphEvents } from './graphEvents';
import { createRenderGraph } from 'utils/graph/createRenderGraph';
import { bindGraphInteractionEvents } from 'utils/graph/bindGraphInteractionEvents';
import { withTiming } from 'utils/with-timing';

export interface GraphManager {
  destroy: () => void;
  init: (options: {
    elements: ElementDefinition[];
    onRender: (collection: CollectionReturnValue) => void;
  }) => void;
}

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

cytoscape.use(popper);

// workerRef.current.onmessage = (event: MessageEvent<number>) =>
// alert(`WebWorker Response => ${event.data}`);

export const createGraphManager = ({
  container,
}: {
  container: HTMLElement;
}): GraphManager => {
  let renderGraph: Core | undefined;
  let traversalGraph: Core | undefined;

  const isDarkOs =
    window.matchMedia && window.matchMedia(THEME_MEDIA_QUERY).matches;

  let theme = isDarkOs ? ThemeName.Dark : ThemeName.Light;

  window.matchMedia(THEME_MEDIA_QUERY).addEventListener('change', (event) => {
    theme = event.matches ? ThemeName.Dark : ThemeName.Light;

    if (!renderGraph) return;

    if (theme === ThemeName.Dark) {
      renderGraph.elements().addClass('dark');
    } else {
      renderGraph.elements().removeClass('dark');
    }
  });

  const init: GraphManager['init'] = withTiming(
    'init',
    ({ elements, onRender }) => {
      traversalGraph = cytoscape({
        headless: true,
        elements,
      });

      renderGraph = createRenderGraph({ container, elements, theme, onRender });

      bindGraphInteractionEvents({
        traversalGraph,
        renderGraph,
        theme,
        onRender,
      });
    }
  );

  const destroy = () => {
    renderGraph?.removeAllListeners();
    renderGraph?.destroy();
    renderGraph = undefined;

    traversalGraph?.destroy();
    traversalGraph = undefined;

    graphEvents.removeAllListeners();
  };

  return { init, destroy };
};
