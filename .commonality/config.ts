import { defineConfig, defineConformer } from 'commonality';
import * as recommended from 'commonality-conform-recommended';

// Only use message (maybe change to name) and ensure uniqueness
const ensureScript = defineConformer<{ name: string; value: string }>(
  (options) => ({
    name: 'COMMONALITY/ENSURE_SCRIPT',
    validate: async ({ json }) =>
      !!json('package.json').get(`scripts[${options?.name}]`),

    fix: async ({ json }) =>
      json('package.json').set(
        `scripts[${options?.name}]`,
        options?.value ?? '',
      ),
    message: `Packages must include a "${options?.name}" script.`,
  }),
);

const ensureInternalPackage = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_INTERNAL_PACKAGE',
  message: 'Internal packages must have a specific package.json configuration.',
  validate: async ({ json }) => {
    // Maybe introduce .equals matcher which handles stripping whitespace and regex matching with .matches
    const packageJson = json('package.json');
    return (
      (await packageJson.get('main')) === 'src/index.ts' &&
      (await packageJson.get('types')) === 'src/index.ts' &&
      (await packageJson.get('publishConfig.main')) === 'dist/index.js' &&
      (await packageJson.get('publishConfig.types')) === 'dist/index.d.ts'
    );
  },
  fix: async ({ json }) => {
    const packageJson = json('package.json');

    await packageJson.set('main', 'src/index.ts');
    await packageJson.set('types', 'src/index.ts');
    await packageJson.set('publishConfig.main', 'dist/index.js');
    await packageJson.set('publishConfig.types', 'dist/index.d.ts');
  },
}));

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
