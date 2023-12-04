import { Options } from 'tsup';

const config: Options = {
  banner: {
    js: `
		import { createRequire } from 'module'; 
		const require = createRequire(import.meta.url);
        `,
  },
  entryPoints: ['src/cli/cli.ts'],
  format: ['esm'],
  platform: 'node',
  noExternal: [
    '@commonalityco/data-codeowners',
    '@commonalityco/feature-conformance',

    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/data-violations',
    '@commonalityco/studio',
    '@commonalityco/feature-conformance',
    '@commonalityco/utils-core',
  ],
  outDir: './dist/cli',
  cjsInterop: true,
};

export default config;
