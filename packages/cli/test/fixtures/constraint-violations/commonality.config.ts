import { defineConfig } from 'commonality';

export default defineConfig({
  project: 'constraint-violations',
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
