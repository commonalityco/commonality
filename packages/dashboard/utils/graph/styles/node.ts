import { getIsDarkMode } from './../getIsDarkMode';
import { NodeSingular, Stylesheet } from 'cytoscape';

const fontSize = 32;

export const nodeStyles: Stylesheet[] = [
  {
    selector: 'node',
    style: {
      label: 'data(id)',
      shape: 'roundrectangle',
      'font-size': fontSize,
      // 'font-family': 'var(--font-inter)',
      'background-color': '#fff',
      color: '#27272a',
      'border-width': 1,
      'border-style': 'solid',
      'border-color': 'gray',
      'text-halign': 'center',
      'text-valign': 'center',
      height: (node: NodeSingular) => {
        const padding = 32;

        return fontSize + padding;
      },
      width: (node: NodeSingular) => {
        const padding = 48;
        const ctx = document.createElement('canvas').getContext('2d');

        if (!ctx) return 0;

        const fStyle = node.style('font-style');
        const size = node.style('font-size');
        const family = node.style('font-family');
        const weight = node.style('font-weight');

        ctx.font = fStyle + ' ' + weight + ' ' + size + ' ' + family;

        const metrics = ctx.measureText(node.data('name'));

        return Math.floor(metrics.width) + padding;
      },
    },
  },
  {
    selector: 'node.dark',
    style: {
      'background-color': '#18181b',
      color: '#fff',
    },
  },
];
