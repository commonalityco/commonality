import { Stylesheet } from 'cytoscape';

const colors = {
  light: {
    // Neutral 300
    default: '#52525b',
    fail: '#dc2626',
    pass: '#16a34a',
  },
  dark: {
    default: '#71717a',
    fail: '#ef4444',
    pass: '#10b981',
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
      'line-color': colors.light.default,
      opacity: 0.25,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.pass',
    style: {
      'line-color': colors.light.pass,
      'target-arrow-color': colors.light.pass,
      'underlay-color': colors.light.pass,
      'z-index': 10,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.fail',
    style: {
      'line-color': colors.light.fail,
      'target-arrow-color': colors.light.fail,
      'underlay-color': colors.light.fail,
      'z-index': 10,
      opacity: 1,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.dark',
    style: {
      'line-color': colors.dark.default,
      'target-arrow-color': colors.dark.default,
      'underlay-color': colors.dark.default,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.pass.dark',
    style: {
      'line-color': colors.dark.pass,
      'target-arrow-color': colors.dark.pass,
      'underlay-color': colors.dark.pass,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.fail.dark',
    style: {
      'line-color': colors.dark.fail,
      'target-arrow-color': colors.dark.fail,
      'underlay-color': colors.dark.fail,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge.dim',
    style: {
      opacity: 0.1,
    },
  },
  {
    selector: 'edge.focus',
    style: {
      opacity: 1,
    },
  },
  {
    selector: 'edge.hover',
    style: {
      opacity: 1,
      'z-index': 100,
      'underlay-padding': 10,
      'underlay-opacity': 0.35,
    } as cytoscape.Css.Edge,
  },
];
