import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./scripts/start.ts', './scripts/dev-start.ts'],
  outDir: 'dist',
  clean: true,
  dts: true,
});
