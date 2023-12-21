import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/integration/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
