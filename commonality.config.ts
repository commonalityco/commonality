import { defineConfig } from 'commonality';
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [
      recommended.hasReadme(),
      recommended.hasCodeowner(),
      recommended.hasValidPackageName(),
      recommended.hasUniqueDependencyTypes(),
      recommended.hasSortedDependencies(),
      recommended.hasMatchingDevPeerVersions(),
      recommended.hasConsistentExternalVersion(),
      recommended.extendsRepositoryField(),
    ],
  },
  constraints: {
    application: {
      allow: ['ui', 'data', 'utility', 'config'],
      disallow: ['application'],
    },
    ui: {
      allow: ['ui', 'state', 'utility', 'config'],
      disallow: ['application'],
    },
    data: {
      allow: ['data', 'utility', 'config'],
      disallow: ['application'],
    },
    state: {
      allow: ['utility', 'config'],
      disallow: ['application'],
    },
    utility: {
      allow: ['utility', 'config'],
      disallow: ['application'],
    },
    config: {
      disallow: '*',
    },
  },
});
