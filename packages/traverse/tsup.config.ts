import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,

  onSuccess: 'tsc --project tsconfig.json',
});
