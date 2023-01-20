import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/cli.ts', 'src/index.ts'],
	outDir: 'dist',
	clean: true,
	dts: {
		resolve: true,
		entry: 'src/index.ts',
	},
});
