import { Stylesheet } from 'cytoscape';
import { firaCode } from 'constants/fonts';

const fontSize = 24;

const fontFamily = firaCode.style.fontFamily.replace(/('|")/g, '');

export const nodeStyles: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(id)',
      shape: 'roundrectangle',
      'font-size': fontSize,
      'font-family': fontFamily,
      'background-color': '#fff',
      color: '#27272a',
      'border-width': 1,
      'border-style': 'solid',
      'border-color': '#d4d4d8',
      'text-halign': 'center',
      'text-valign': 'center',
    },
  },
  {
    selector: 'node.dim',
    style: {
      opacity: 0.3,
    },
  },
  {
    selector: 'node.dark',
    style: {
      'background-color': '#18181b',
      'border-color': '#52525b',
      color: '#fff',
    },
  },
];
