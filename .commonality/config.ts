import { defineConfig, defineConformer } from 'commonality';

export default defineConfig({
  projectId: '123',
  conformers: {},
  constraints: {
    feature: { allow: '*' },
    deliverable: { disallow: ['deliverable'] },
    config: { allow: ['config'], disallow: ['feature'] },
    ui: { allow: ['ui', 'utility', 'config'], disallow: ['feature'] },
    data: { allow: ['data', 'utility', 'config'], disallow: ['feature'] },
    utility: { allow: ['data', 'utility', 'config'], disallow: ['feature'] },
  },
});
