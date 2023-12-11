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
  outDir: './dist/cli',
  cjsInterop: true,
};

export default config;
