import { defineConfig } from 'commonality';

export default defineConfig({
  projectId: 'foo',
  constraints: [
    {
      tags: ['tag-one'],
      allow: ['foo', 'bar'],
    },
  ],
});
