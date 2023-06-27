import { Stylesheet } from 'cytoscape';

const colors = {
  light: {
    default: '#d4d4d8',
    development: '#0284c7',
    peer: '#0284c7',
    production: '#059669',
  },
  dark: {
    default: '#27272a',
    development: '#0284c7',
    peer: '#0284c7',
    production: '#059669',
  },
};

export const edgeStyles: Stylesheet[] = [
  {
    selector: 'edge',
    style: {
      width: 2,
      'target-arrow-color': colors.light.default,
      'target-arrow-shape': 'triangle',
      'curve-style': 'unbundled-bezier',
      'source-endpoint': '0% 50%',
      'target-endpoint': '0% -50%',
      'arrow-scale': 1,
      'line-color': colors.light.default,
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
    selector: 'edge.PRODUCTION',
    style: {
      'line-color': colors.light.production,
      'target-arrow-color': colors.light.production,
      'overlay-color': colors.light.production,
      width: 3,
    },
  },
  {
    selector: 'edge.DEVELOPMENT',
    style: {
      'line-color': colors.light.development,
      'target-arrow-color': colors.light.development,
      'overlay-color': colors.light.development,
      width: 3,
    },
  },
  {
    selector: 'edge.PEER',
    style: {
      'line-color': colors.light.peer,
      'target-arrow-color': colors.light.peer,
      'overlay-color': colors.light.peer,
      width: 3,
    },
  },
  {
    selector: 'edge.dark.PRODUCTION',
    style: {
      'line-color': colors.dark.production,
      'target-arrow-color': colors.dark.production,
      'overlay-color': colors.dark.production,
      width: 3,
    },
  },
  {
    selector: 'edge.dark.DEVELOPMENT',
    style: {
      'line-color': colors.dark.development,
      'target-arrow-color': colors.dark.development,
      'overlay-color': colors.dark.development,
      width: 3,
    },
  },
  {
    selector: 'edge.dark.PEER',
    style: {
      'line-color': colors.dark.peer,
      'target-arrow-color': colors.dark.peer,
      'overlay-color': colors.dark.peer,
      width: 3,
    },
  },
  {
    selector: 'edge.dim',
    style: {
      'z-index': 0,
      opacity: 0.2,
    },
  },
  {
    selector: 'edge.focus',
    style: {
      'z-index': 100,
    },
  },
];
