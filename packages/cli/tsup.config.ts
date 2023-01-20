import { defineConfig } from 'tsup';
import { config } from '@commonalityco/config-tsup';

export default defineConfig({
  ...config,
  entry: ['./src/index.ts', './src/cli.ts'],
  onSuccess: undefined,
});
