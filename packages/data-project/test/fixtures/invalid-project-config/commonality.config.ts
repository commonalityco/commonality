import { defineConfig } from 'commonality';

export default defineConfig({
  constraints: {
    '*': {
      alloww: '*',
    },
    config: {
      allow: ['config'],
    },
    ui: {
      allow: ['ui', 'utility', 'config'],
    },
    data: {
      allow: ['data', 'utility', 'config'],
    },
    utility: {
      allow: ['data', 'utility', 'config'],
    },
  },
});
