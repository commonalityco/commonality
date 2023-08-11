import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  bundle: true,
  treeshake: true,
  esbuildOptions(options, context) {
    options.bundle = true;
  },
  noExternal: [
    '@commonalityco/data-codeowners',
    '@commonalityco/data-documents',
    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/data-violations',
    '@commonalityco/utils-core',
  ],
});
