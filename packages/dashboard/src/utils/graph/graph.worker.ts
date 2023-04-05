import { edgeStyles } from './styles/edge';
import cytoscape, { EdgeSingular } from 'cytoscape';
import { layoutOptions } from 'utils/graph/layoutOptions';
import dagre from 'cytoscape-dagre';
import { nodeStyles } from 'utils/graph/styles/node';
import { ThemeName } from 'constants/ThemeName';
import { updateNodeStyles } from 'utils/graph/updateNodeStyles';

cytoscape.use(dagre);

addEventListener('message', (event: MessageEvent) => {
  const { type } = event.data;

  switch (type) {
    case 'runLayout':
      const { elements, dimensions, theme } = event.data;

      const cy = cytoscape({
        headless: true,
        style: [...nodeStyles, ...edgeStyles],
        styleEnabled: true,
        elements,
        maxZoom: 2,
        minZoom: 0.1,
      });

      if (theme === ThemeName.Dark) {
        cy.elements().addClass('dark');
      } else {
        cy.elements().removeClass('dark');
      }

      updateNodeStyles(cy);

      cy.on('layoutready', () => {
        const json = cy.json();

        self.postMessage({ type: 'layoutCalculated', json });
      });

      cy.layout(layoutOptions).run();

      break;
    // Add more case statements for other message types here
    default:
      console.warn(`Unknown message type: ${type}`);
      break;
  }
});
