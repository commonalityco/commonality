import { defineConfig } from 'commonality';

export default defineConfig({
  projectId: '123',
  constraints: [
    {
      applyTo: 'feature',
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
