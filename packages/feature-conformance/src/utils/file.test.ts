import { describe, expect, it, afterEach } from 'vitest';
import { file } from './file';
import fs from 'fs-extra';
import mock from 'mock-fs';

describe('file', () => {
  afterEach(() => {
    mock.restore();
  });

  describe('delete', () => {
    it('remove the file from disk', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const rawFile = file('package.json');

      await rawFile.delete();

      const exists = await fs.pathExists('package.json');

      expect(exists).toBe(false);
    });

    it('does not throw error when file does not exist', async () => {
      mock({});

      const rawFile = file('package.json');

      await expect(rawFile.delete()).resolves.not.toThrow();
    });
  });

  describe('exists', () => {
    it('returns true when the file exists', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const exists = await file('package.json').exists();

      expect(exists).toBe(true);
    });

    it('returns false when the file does not exist', async () => {
      mock({});

      const exists = await file('package.json').exists();

      expect(exists).toBe(false);
    });
  });
});
