import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/index.ts'],
  format: ['esm'],
  noExternal: [],
  platform: 'node',
  outDir: './dist/utilities',
  cjsInterop: true,
  dts: true,
};

export default config;
