import { defineConfig } from 'commonality';

export default defineConfig({
  projectId: '123',
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
