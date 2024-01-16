import { Options } from 'tsup';

const config: Options = {
  entryPoints: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'node',
  outDir: './dist',
  clean: true,
  noExternal: [/^@commonalityco\/.*/],
  dts: {
    resolve: true,
  },
};

export default config;
