import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { execa } from 'execa';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('smoke', () => {
  it('shows the default help information', async () => {
    await expect(() => execa(binPath)).rejects.toMatchObject({
      exitCode: 1,
      stderr: expect.stringContaining(
        'Infinitely scalable front-end ecosystems',
      ),
    });
  });
});
