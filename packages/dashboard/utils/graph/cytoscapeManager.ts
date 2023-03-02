import { ThemeName } from 'hooks/useTheme';
import cytoscape, {
  ElementDefinition,
  Core,
  SingularData,
  CollectionArgument,
  Selector,
  SingularElementArgument,
  Collection,
} from 'cytoscape';
import { darkModeNamespace } from './getIsDarkMode';
import { layoutOptions } from './layoutOptions';
import { edgeStyles } from './styles/edge';
import { nodeStyles } from './styles/node';
import elk from 'cytoscape-elk';
import popper from 'cytoscape-popper';
import { createShadowGraphManager } from './shadowGraphManager';

cytoscape.use(elk);
cytoscape.use(popper);

export const createCytoscapeManager = () => {
  let _renderGraph: Core | undefined;
  let _traversalGraph: Core | undefined;

  let _container: HTMLElement | undefined;
  let _theme: ThemeName.Dark | ThemeName.Light | undefined;

  const shadowGraph = createShadowGraphManager();

  const render = (collection: Collection) => {
    if (_renderGraph) {
      _renderGraph.destroy();
      _renderGraph = undefined;
    }

    _renderGraph = cy({
      headless: this.activeContainer === null,
      container: this.activeContainer,
      boxSelectionEnabled: false,
      style: [...nodeStyles, ...edgeStyles],
      panningEnabled: true,
      userZoomingEnabled: this.renderMode !== 'nx-docs',
    });
  };

  const createTraversalGraph = (elements: ElementDefinition[]) => {
    _traversalGraph = cytoscape({
      headless: true,
      style: [...nodeStyles, ...edgeStyles],
      elements,
    });
  };

  const mountGraph = (elements: ElementDefinition[]) => {
    _cy = cytoscape({
      container: _container,
      style: [...nodeStyles, ...edgeStyles],
      layout: layoutOptions,
      autoungrabify: true,
      elements:
        _theme === ThemeName.Dark
          ? elements.map((element) => ({ ...element, classes: 'dark' }))
          : elements,
    });
  };

  const init = ({
    elements,
    container,
    theme,
  }: {
    elements: Collection;
    container: HTMLElement;
    theme: ThemeName.Dark | ThemeName.Light;
  }) => {
    if (_cy) return;
    _theme = theme;
    _container = container;

    shadowGraph.init({ elements });
    mountGraph(elements);
  };

  const setElements = (
    selector?:
      | Selector
      | ((
          ele: SingularElementArgument,
          i: number,
          eles: CollectionArgument
        ) => boolean)
  ) => {
    if (!selector) {
      _cy?.remove(_cy.elements());
    }
  };

  const setTheme = (theme: ThemeName.Dark | ThemeName.Light) => {
    if (!theme) return;
    if (_cy) {
      if (theme === ThemeName.Dark) {
        _cy.elements().addClass('dark');
      } else {
        _cy.elements().removeClass('dark');
      }
    }
  };

  const fit = (elements?: CollectionArgument) => {
    if (_cy) {
      console.log('FIT');

      _cy.fit(elements, 24);
    }
  };

  return { init, setTheme, fit, setElements };
};
