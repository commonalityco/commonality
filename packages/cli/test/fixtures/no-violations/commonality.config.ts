import { defineConfig } from 'commonality';

export default defineConfig({
  projectId: 'no-violations',
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
