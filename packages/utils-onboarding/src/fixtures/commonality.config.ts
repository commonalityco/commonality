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
  constraints: {},
});
