import { defineConfig } from 'commonality';

export default defineConfig({
	project: 'missing-package-configuration',
	constraints: [
		{
			tags: ['tag-one'],
			allow: ['tag-two'],
		},
		{
			tags: ['tag-two'],
			allow: ['tag-three'],
		},
	],
});
