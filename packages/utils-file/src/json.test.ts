import { describe, it, expect, afterEach } from 'vitest';
import { json } from './json';
import mock from 'mock-fs';

describe('json', () => {
  afterEach(() => {
    mock.restore();
  });

  describe('get', () => {
    it('should return the JSON file', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const result = await json('./', 'package.json').get();

      expect(result).toEqual({
        name: 'pkg-a',
        scripts: {
          build: 'build',
        },
      });
    });

    it('returns undefined when the file does not exist', async () => {
      mock({});

      const result = await json('./', 'package.json').get();

      expect(result).toEqual(undefined);
    });
  });

  describe('contains', () => {
    it('should return true if the file contains the value', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const result = await json('./', 'package.json').contains({
        scripts: {
          build: 'build',
        },
      });

      expect(result).toEqual(true);
    });

    it('should return false if the file does not contain the value', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const result = await json('./', 'package.json').contains({
        scripts: {
          dev: 'foo',
        },
      });

      expect(result).toEqual(false);
    });

    it('should return false if the file contains a partial match', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            dev: 'dev',
            build: 'build',
          },
        }),
      });
      const result = await json('./', 'package.json').contains({
        scripts: {
          dev: 'dev',
          baz: 'baz',
        },
      });

      expect(result).toEqual(false);
    });

    it('should return false if the file does not exist', async () => {
      mock({});

      const result = await json('./', 'package.json').contains({
        scripts: {
          dev: 'dev',
          baz: 'baz',
        },
      });

      expect(result).toEqual(false);
    });
  });

  describe('set', () => {
    it('should overwrite the JSON file', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      await json('./nested', 'package.json').set({
        scripts: { build: 'npm run build' },
      });

      const result = await json('./nested', 'package.json').get();

      expect(result).toEqual({
        scripts: {
          build: 'npm run build',
        },
      });
    });

    it('should create the file and set the value if the file does not exist', async () => {
      mock({});

      await json('./', 'package.json').set({
        scripts: { build: 'npm run build' },
      });

      const result = await json('./', 'package.json').get();

      expect(result).toEqual({
        scripts: {
          build: 'npm run build',
        },
      });
    });

    it('should leave the file unchanged if set is called with no arguments', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const originalJson = await json('./', 'package.json').get();

      // @ts-expect-error - Testing invalid arguments
      await json('./package.json').set();

      const result = await json('./', 'package.json').get();

      expect(result).toEqual(originalJson);
    });
  });

  describe('merge', () => {
    it('should merge values into an existing JSON file', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      await json('./', 'package.json').merge({
        publishConfig: { access: 'public' },
      });

      const result = await json('./', 'package.json').get();

      expect(result).toEqual({
        name: 'pkg-a',
        scripts: {
          build: 'build',
        },
        publishConfig: {
          access: 'public',
        },
      });
    });

    it('should create the file and merge the values if the file does not exist', async () => {
      mock({});

      await json('./', 'package.json').merge({
        scripts: { test: 'npm run test' },
      });

      const result = await json('./', 'package.json').get();

      expect(result).toEqual({
        scripts: {
          test: 'npm run test',
        },
      });
    });

    it('should return the original source object if nothing is passed', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          scripts: {
            build: 'build',
          },
        }),
      });

      const originalJson = await json('./', 'package.json').get();

      // @ts-expect-error - Testing invalid arguments
      await json('./', 'package.json').merge();

      const updatedJson = await json('./', 'package.json').get();

      expect(updatedJson).toEqual(originalJson);
    });
  });

  describe('remove', () => {
    it('should remove value from JSON file', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          workspaces: [],
          scripts: {
            build: 'build',
          },
        }),
      });

      await json('./', 'package.json').remove('scripts.build');

      const result = await json('./', 'package.json').get();

      expect(result).toEqual({
        name: 'pkg-a',
        workspaces: [],
        scripts: {},
      });
    });

    it('should do nothing if remove is called with no arguments', async () => {
      mock({
        'package.json': JSON.stringify({
          name: 'pkg-a',
          workspaces: [],
          scripts: {
            build: 'build',
          },
        }),
      });

      const originalJson = await json('./', 'package.json').get();

      //   @ts-expect-error - Testing invalid arguments
      await json('./', 'package.json').remove();

      const result = await json('./', 'package.json').get();

      expect(result).toEqual(originalJson);
    });

    it('should do nothing if the file does not exist', async () => {
      mock({});

      await expect(
        json('./', 'package.json').remove('version'),
      ).resolves.toEqual(undefined);
    });
  });
});
