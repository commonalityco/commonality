import { Stylesheet } from 'cytoscape';

const colors = {
  light: {
    default: '#d4d4d8',
    development: '#3b82f6',
    peer: '#a855f7',
    production: '#10b981',
  },
  dark: {
    default: '#52525b',
    development: '#2563eb',
    peer: '#7c3aed',
    production: '#059669',
  },
};

export const edgeStyles: Stylesheet[] = [
  {
    selector: 'edge',
    style: {
      width: 3,
      'target-arrow-color': colors.light.default,
      'target-arrow-shape': 'triangle',
      'curve-style': 'unbundled-bezier',
      'source-endpoint': '0% 50%',
      'target-endpoint': '0% -50%',
      'arrow-scale': 1.5,
      'transition-duration': 0.5,
      'transition-timing-function': 'ease-in-out',
      'overlay-color': 'gray',
      'line-color': '#d4d4d8',
    },
  },
  {
    selector: 'edge.dark',
    style: {
      'line-color': colors.dark.default,
      'target-arrow-color': colors.dark.default,
    },
  },
  {
    selector: 'edge.dim',
    style: {
      'z-index': 0,
      opacity: 0.3,
    },
  },
  {
    selector: 'edge.focus',
    style: {
      'z-index': 100,
    },
  },
];
