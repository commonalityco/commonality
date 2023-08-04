import { DependencyType } from '@commonalityco/utils-core';
import cytoscape, { Stylesheet } from 'cytoscape';

const colors = {
  light: {
    default: '#e4e4e7',
    development: '#0284c7',
    peer: '#0284c7',
    production: '#059669',
    violation: '#FF0000',
  },
  dark: {
    default: '#27272a',
    development: '#0284c7',
    peer: '#0284c7',
    production: '#059669',
    violation: '#FF0000',
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
      'arrow-scale': 1.3,
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
    selector: `edge.${DependencyType.PRODUCTION}`,
    style: {
      'line-color': colors.light.production,
      'target-arrow-color': colors.light.production,
      'overlay-color': colors.light.production,
      width: 3,
    },
  },
  {
    selector: `edge.${DependencyType.DEVELOPMENT}`,
    style: {
      'line-color': colors.light.development,
      'target-arrow-color': colors.light.development,
      'overlay-color': colors.light.development,
      width: 3,
    },
  },
  {
    selector: `edge.${DependencyType.PEER}`,
    style: {
      'line-color': colors.light.peer,
      'target-arrow-color': colors.light.peer,
      'overlay-color': colors.light.peer,
      width: 3,
    },
  },
  {
    selector: `edge.dark.${DependencyType.PRODUCTION}`,
    style: {
      'line-color': colors.dark.production,
      'target-arrow-color': colors.dark.production,
      'overlay-color': colors.dark.production,
      width: 3,
    },
  },
  {
    selector: `edge.dark.${DependencyType.DEVELOPMENT}`,
    style: {
      'line-color': colors.dark.development,
      'target-arrow-color': colors.dark.development,
      'overlay-color': colors.dark.development,
      width: 3,
    },
  },
  {
    selector: `edge.dark.${DependencyType.PEER}`,
    style: {
      'line-color': colors.dark.peer,
      'target-arrow-color': colors.dark.peer,
      'overlay-color': colors.dark.peer,

      width: 3,
    },
  },
  {
    selector: 'edge.violation',
    style: {
      'line-color': colors.dark.violation,
      'target-arrow-color': colors.dark.violation,
      'overlay-color': colors.dark.violation,
      'z-index': 10,
    },
  },
  {
    selector: 'edge.dim',
    style: {
      'z-index': 0,
      opacity: 0.1,
    },
  },
  {
    selector: 'edge.dark.dim',
    style: {
      'z-index': 0,
      opacity: 0.2,
    },
  },
  {
    selector: 'edge.hover',
    style: {
      'z-index': 100,
      'overlay-padding': 8,
      'overlay-opacity': 0.35,
    },
  },
];
