import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    threads: false,
    setupFiles: ['./test/setup.ts'],
  },
});
