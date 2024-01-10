import { defineConfig } from 'commonality';
import * as recommended from 'commonality-checks-recommended';

const hasScripts = recommended.hasJsonFile('package.json', {
  scripts: {
    build: 'tsc --build',
    dev: 'tsc --watch',
    lint: 'eslint .',
    'type-check': 'tsc --noEmit',
  },
});

const hasESLintConfig = recommended.hasJsonFile('.eslintrc.json', {
  root: true,
  extends: ['commonality'],
});

const hasClientTSConfig = recommended.hasJsonFile('tsconfig.json', {
  extends: '@commonalityco/config-tsconfig/react.json',
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  compilerOptions: {
    outDir: 'dist',
    typeRoots: ['./node_modules/@types'],
  },
});

const hasServerTSConfig = recommended.hasJsonFile('tsconfig.json', {
  extends: '@commonalityco/config-tsconfig/node.json',
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  compilerOptions: {
    outDir: 'dist',
    typeRoots: ['./node_modules/@types'],
  },
});

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
    ui: [hasScripts, hasESLintConfig, hasClientTSConfig],
    state: [hasScripts, hasESLintConfig, hasClientTSConfig],
    data: [hasScripts, hasESLintConfig, hasServerTSConfig],
    utility: [hasScripts, hasESLintConfig, hasServerTSConfig],
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
