import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  onSuccess:
    'tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist src/index.ts',
});
