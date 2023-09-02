import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    threads: false,
    setupFiles: ['./test/setup.ts'],
  },
});
