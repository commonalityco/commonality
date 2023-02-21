import { getIsDarkMode } from './../getIsDarkMode';
import { Stylesheet } from 'cytoscape';

export const edgeStyles: Stylesheet[] = [
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#d4d4d8',
      'target-arrow-color': '#d4d4d8',
      'target-arrow-shape': 'triangle',
      'curve-style': 'unbundled-bezier',
      'source-endpoint': '0% 50%',
      'target-endpoint': '0% -50%',
    },
  },
  {
    selector: 'edge.dark',
    style: {
      'line-color': '#52525b',
      'target-arrow-color': '#52525b',
    },
  },
];
