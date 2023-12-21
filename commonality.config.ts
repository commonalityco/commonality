import { defineCheck, defineConfig } from 'commonality';
import * as recommended from 'commonality-recommended';

export default defineConfig({
  checks: {
    '*': [
      recommended.ensureReadme(),
      recommended.ensureCodeowner(),
      recommended.validPackageName(),
      recommended.multipleDependencyTypes(),
      recommended.sortedDependencies(),
      recommended.devPeerDependencyRange(),
      recommended.noExternalMismatch(),
      recommended.repositoryField(),
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
