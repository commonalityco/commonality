import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./scripts/start.ts', './scripts/e2e-start.ts'],
  outDir: 'dist',
  clean: true,
  dts: true,
});
