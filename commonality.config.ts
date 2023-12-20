// @ts-check
import { defineCheck, defineConfig, json } from 'commonality';
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
    testable: [
      defineCheck(() => {
        return {
          name: 'ensure-test-tooling',
          message: 'Testable packages must have test tooling configured',
          validate: ({ workspace }) => {},
        };
      }),
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
