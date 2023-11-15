import { defineConfig, defineConformer } from 'commonality';
import * as recommended from 'commonality-conform-recommended';

// Only use message (maybe change to name) and ensure uniqueness
const ensureScript = defineConformer<{ name: string; value: string }>(
  (options) => ({
    name: 'COMMONALITY/ENSURE_SCRIPT',
    validate: async (read) =>
      read.json('package.json').get(`scripts[${options?.name}]`),

    fix: async (update) =>
      update
        .json('package.json')
        .set(`scripts[${options?.name}]`, options?.value ?? ''),
    message: `Packages must include a "${options?.name}" script.`,
  }),
);

const ensureInternalPackage = defineConformer(() => {
  const expectedPackageJson = {
    type: 'module',
    main: './src/index.ts',
    types: './src/index.ts',
    publishConfig: {
      main: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': './dist/index.js',
      },
    },
    scripts: {
      build: 'tsc --build',
    },
  };

  return {
    name: 'COMMONALITY/ENSURE_INTERNAL_PACKAGE',
    message:
      'Internal packages must have a specific package.json configuration.',
    validate: async ({ json }) => {
      const packageJson = json('package.json');

      return packageJson.contains(expectedPackageJson);
    },
    fix: async ({ json }) => {
      return json('package.json').merge(expectedPackageJson);
    },
  };
});

export default defineConfig({
  projectId: '123',
  conformers: {
    internal: [ensureInternalPackage()],
    buildable: [
      ensureScript({
        name: 'type-check',
        value: 'tsc --noEmit',
      }),
      ensureScript({ name: 'lint', value: 'eslint .' }),
      ensureScript({
        name: 'lint:fix',
        value: 'eslint . --fix',
      }),
    ],
    '*': [
      recommended.ensureReadme(),
      recommended.ensureCodeowner(),
      recommended.ensurePackageName(),
      recommended.ensureSortedDependencies(),
      recommended.ensureVersion({
        dependencies: ['next'],
        version: '14.0.1',
      }),
      recommended.ensureVersion({
        dependencies: ['typescript'],
        version: '^5.2.2',
        type: ['development'],
      }),
      recommended.ensureVersion({
        dependencies: ['react', 'react-dom'],
        version: '^18.2.0',
        type: ['production', 'development'],
      }),
      recommended.ensureVersion({
        dependencies: ['react', 'react-dom'],
        version: '>=18',
        type: ['peer'],
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
