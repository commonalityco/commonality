import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./scripts/start.ts'],
  outDir: 'dist',
  clean: true,
  dts: true,
});
