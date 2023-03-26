import { Stylesheet } from 'cytoscape';
import { DependencyType } from '@commonalityco/types';
import { memoize } from 'lodash';

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
      width: 2,
      'line-color': colors.light.default,
      'target-arrow-color': colors.light.default,
      'target-arrow-shape': 'triangle',
      'curve-style': 'unbundled-bezier',
      'source-endpoint': '0% 50%',
      'target-endpoint': '0% -50%',
      'control-point-weights': '0.2 0.8',
      'control-point-distances': 'data(controlPointDistances)',
      'active-bg-color': '#a7f3d0',
      'arrow-scale': 1.5,
      'transition-duration': 0.5,
      'transition-timing-function': 'ease-in-out',
      'overlay-color': 'red',
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
      'line-color': memoize((edge) => {
        switch (edge.data('type')) {
          case DependencyType.PEER:
            return colors.light.default;
          case DependencyType.DEVELOPMENT:
            return colors.light.development;
          case DependencyType.PRODUCTION:
            return colors.light.production;
          default:
            return colors.light.default;
        }
      }),
      'target-arrow-color': memoize((edge) => {
        switch (edge.data('type')) {
          case DependencyType.PEER:
            return colors.light.default;
          case DependencyType.DEVELOPMENT:
            return colors.light.development;
          case DependencyType.PRODUCTION:
            return colors.light.production;
          default:
            return colors.light.default;
        }
      }),
    },
  },
];
