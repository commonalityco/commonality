import { defineConfig } from 'commonality';
import {
  noExternalMismatch,
  devPeerDependencyRange,
  validPackageName,
  sortedDependencies,
  repositoryField,
} from 'commonality-conform-recommended';

export default defineConfig({
  projectId: '123',
  conformers: {
    '*': [
      validPackageName(),
      sortedDependencies(),
      devPeerDependencyRange(),
      noExternalMismatch(),
      repositoryField(),
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
