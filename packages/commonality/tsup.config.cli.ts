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
    '@commonalityco/data-conformance',
    '@commonalityco/data-documents',
    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/data-violations',
    '@commonalityco/data-workspaces',
    '@commonalityco/studio',
    '@commonalityco/utils-conformance',
    '@commonalityco/utils-core',
    '@commonalityco/utils-file',
  ],
  outDir: './dist/cli',
  cjsInterop: true,
};

export default config;
