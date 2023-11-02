import { defineConfig, defineConformer } from 'commonality';
import * as recommended from 'commonality-conform-recommended';

const ensureScript = defineConformer<{ name: string; value: string }>(
  (options) => ({
    name: 'COMMONALITY/ENSURE_SCRIPT',
    validate: async ({ json }) => {
      return Boolean(
        await json('package.json').get(`scripts[${options?.name}]`),
      );
    },
    fix: async ({ json }) => {
      return json('package.json').set(
        `scripts[${options?.name}]`,
        options?.value ?? '',
      );
    },
    message: `Packages must include a "${options?.name}" script.`,
  }),
);

export default defineConfig({
  projectId: '123',
  conformers: {
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
        version: '13.4.19',
        type: ['production', 'development'],
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
