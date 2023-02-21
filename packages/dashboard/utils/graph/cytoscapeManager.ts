import { ThemeName } from '@/hooks/useTheme';
import cytoscape, {
  ElementDefinition,
  Core,
  SingularData,
  CollectionArgument,
} from 'cytoscape';
import { darkModeNamespace } from './getIsDarkMode';
import { layoutOptions } from './layoutOptions';
import { edgeStyles } from './styles/edge';
import { nodeStyles } from './styles/node';
import elk from 'cytoscape-elk';

cytoscape.use(elk);

export const createCytoscapeManager = () => {
  let _cy: Core | undefined;

  const init = ({
    elements,
    container,
    theme,
  }: {
    elements: ElementDefinition[];
    container: HTMLElement;
    theme: ThemeName.Dark | ThemeName.Light;
  }) => {
    if (_cy) return;
    const isDark = theme === ThemeName.Dark;
    _cy = cytoscape({
      container,
      style: [...nodeStyles, ...edgeStyles],
      layout: layoutOptions,
      elements: isDark
        ? elements.map((element) => ({ ...element, classes: 'dark' }))
        : elements,
    });
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
      _cy.fit(elements, 24).center().resize();
    }
  };

  return { init, setTheme, fit };
};
