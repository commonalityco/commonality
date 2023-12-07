import { Options } from 'tsup';

const config: Options = {
  banner: {
    js: `
		
		const require = createRequire(import.meta.url);
        `,
  },
  entryPoints: ['src/cli/cli.ts'],
  format: ['esm'],
  platform: 'node',
  noExternal: [
    '@commonalityco/data-codeowners',
    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/studio',
    '@commonalityco/feature-conformance',
    '@commonalityco/utils-core',
  ],
  outDir: './dist/cli',
  cjsInterop: true,
};

export default config;
