import path from 'path';
import { getRootDirectory } from '../src/get-root-directory';
import { describe, expect, it } from 'vitest';

describe('getRootDirectory', () => {
  it('should return the root directory of the project', async () => {
    const cwd = path.join(__dirname, './fixtures', 'deeply-nested');
    const rootDirectory = await getRootDirectory(cwd);

    expect(rootDirectory).toMatch(cwd);
  });

  it('should throw an error if no lockfile is found', async () => {
    const cwd = path.join(__dirname, './fixtures', 'deeply-nested');
    await getRootDirectory(cwd);

    await expect(
      getRootDirectory('/path/to/nonexistent/directory'),
    ).rejects.toThrow('No lockfile found');
  });
});
