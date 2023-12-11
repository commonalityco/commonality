import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  outDir: './dist/utilities',
  noExternal: ['@commonalityco/feature-conformance', '@commonalityco/types'],
  cjsInterop: true,
  dts: true,
};

export default config;
