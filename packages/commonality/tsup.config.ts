import { defineConfig } from 'tsup';
import packageJson from './package.json';

const STUDIO_NAME = '@commonalityco/studio';

const bundledDependencies = Object.keys(packageJson.dependencies).filter(
  (key) => key !== STUDIO_NAME,
);

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  format: 'esm',
  minify: true,
  metafile: true,
  noExternal: bundledDependencies,
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});
