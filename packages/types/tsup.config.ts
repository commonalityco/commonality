import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	clean: true,

	onSuccess: 'tsc --declarationMap --project tsconfig.json',
});
