export const config = {
	entry: ['src/index.ts'],
	outDir: 'dist',
	clean: true,
	dts: {
		resolve: true,
		entry: 'src/index.ts',
	},
	onSuccess: 'tsc --project tsconfig.json',
};
