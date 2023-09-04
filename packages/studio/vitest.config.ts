import path from 'path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
});
