import path from 'node:path';
import { getRootDirectory } from '../src/get-root-directory';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getRootDirectory', () => {
  it('should return the root directory of the project', async () => {
    const cwd = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'deeply-nested',
    );
    const rootDirectory = await getRootDirectory(cwd);

    expect(rootDirectory).toMatch(cwd);
  });

  it('should throw an error if no lockfile is found', async () => {
    const cwd = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './fixtures',
      'deeply-nested',
    );
    await getRootDirectory(cwd);

    await expect(
      getRootDirectory('/path/to/nonexistent/directory'),
    ).rejects.toThrow('No lockfile found');
  });
});
