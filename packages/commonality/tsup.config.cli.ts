import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/cli/cli.ts'],
  format: ['esm'],
  platform: 'node',
  outDir: './dist/cli',
  cjsInterop: true,
  noExternal: ['@commonalityco/feature-constraints'],
};

export default config;
