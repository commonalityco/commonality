import { Stylesheet } from 'cytoscape';

export const fontSize = 24;
export const fontFamily = 'Fira Code, monospace';
export const fontWeight = 600;

export const nodeStyles: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(id)',
      width: 'data(width)',
      height: 'data(height)',
      shape: 'roundrectangle',
      'text-margin-x': 20,
      'background-height': 42,
      'background-width': 42,
      'background-position-x': '26px',
      'background-position-y': '30px',
      'background-image': 'data(image)',
      'font-size': fontSize,
      'font-family': fontFamily,
      'font-weight': fontWeight,
      'background-color': '#fafafa',
      'padding-top': '0px',
      'padding-bottom': '0px',
      'padding-left': '16px',
      'padding-right': '16px',
      color: '#27272a',
      'border-width': 2,
      'border-style': 'solid',
      'border-color': '#d4d4d8',
      'text-halign': 'center',
      'text-valign': 'center',
      'underlay-padding': 24,
      'underlay-opacity': 0,
      'overlay-padding': 24,
      'underlay-color': '#d4d4d8',
      'overlay-color': '#d4d4d8',
    } as cytoscape.Css.Node,
  },
  {
    selector: 'node:active',
    style: {
      'underlay-opacity': 1,
    } as cytoscape.Css.Node,
  },
  {
    selector: 'node.dim',
    style: {
      opacity: 0.1,
    },
  },
  {
    selector: 'node.hover',
    style: {
      'underlay-opacity': 0.75,
    } as cytoscape.Css.Node,
  },
  {
    selector: 'node.dark',
    style: {
      'background-color': '#18181b',
      'border-color': '#3f3f46',
      color: '#fff',
      'overlay-color': '#27272a',
      'underlay-color': '#27272a',
    } as cytoscape.Css.Node,
  },
  {
    selector: 'node.dark.hover',
    style: {
      // 'border-color': '#3f3f46',
      // color: '#fff',
      // 'overlay-color': '#09090b',
      // 'underlay-color': '#09090b',
    },
  },
];
