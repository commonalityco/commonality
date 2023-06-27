import { Stylesheet } from 'cytoscape';

export const fontSize = 24;
export const fontFamily = 'Fira Code';
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
      'background-position-x': '24px',
      'background-position-y': '16px',
      'background-image': 'data(image)',
      'font-size': fontSize,
      'font-family': fontFamily,
      'font-weight': fontWeight,
      'background-color': '#e4e4e7',
      color: '#27272a',
      'border-width': 1,
      'border-style': 'solid',
      'border-color': '#a1a1aa',
      'text-halign': 'center',
      'text-valign': 'center',
      'transition-duration': 175,
      'transition-delay': 0,
      'transition-timing-function': 'ease-in-out',
      'transition-property': 'opacity',
    },
  },
  {
    selector: 'node.dim',
    style: {
      opacity: 0.2,
    },
  },
  {
    selector: 'node.dark',
    style: {
      'background-color': '#27272a',
      'border-color': '#3f3f46',
      color: '#fff',
    },
  },
];
