import { defineConfig } from 'commonality';
import {
  noExternalMismatch,
  devPeerDependencyRange,
  validPackageName,
  sortedDependencies,
} from 'commonality-conform-recommended';

export default defineConfig({
  projectId: '123',
  conformers: {
    '*': [
      validPackageName(),
      sortedDependencies(),
      devPeerDependencyRange(),
      noExternalMismatch(),
    ],
  },
  constraints: {
    feature: { allow: '*' },
    deliverable: { disallow: ['deliverable'] },
    config: { allow: ['config'], disallow: ['feature'] },
    ui: { allow: ['ui', 'utility', 'config'], disallow: ['feature'] },
    data: { allow: ['data', 'utility', 'config'], disallow: ['feature'] },
    utility: { allow: ['data', 'utility', 'config'], disallow: ['feature'] },
  },
});
