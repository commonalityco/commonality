import { defineConfig } from 'commonality';

export default defineConfig({
  project: 'foo',
  constraints: [
    {
      tags: ['tag-one'],
      allow: ['foo', 'bar'],
    },
  ],
});
