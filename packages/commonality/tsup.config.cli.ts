import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/cli/cli.ts'],
  format: ['esm'],
  platform: 'node',
  outDir: './dist/cli',
  cjsInterop: true,
  noExternal: [/^@commonalityco\/.*/],
  treeshake: true,
};

export default config;
