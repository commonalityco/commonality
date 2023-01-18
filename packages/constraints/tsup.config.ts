import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	clean: true,
	format: ['esm'],
	onSuccess: 'tsc --project tsconfig.json',
});
