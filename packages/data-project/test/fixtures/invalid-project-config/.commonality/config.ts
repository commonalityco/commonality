import { defineConfig } from 'commonality';

export default defineConfig({
  constraints: [
    {
      applyToo: 'feature',
      allow: '*',
    },
    {
      applyTo: 'config',
      allow: ['config'],
    },
    {
      applyTo: 'ui',
      allow: ['ui', 'utility', 'config'],
    },
    {
      applyTo: 'data',
      allow: ['data', 'utility', 'config'],
    },
    {
      applyTo: 'utility',
      allow: ['data', 'utility', 'config'],
    },
  ],
});
