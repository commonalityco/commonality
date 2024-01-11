import path from 'node:path';
import {
  getProjectConfig,
  getValidatedProjectConfig,
} from '../src/get-project-config';
import { describe, expect, it, test } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getValidatedProjectConfig', () => {
  test('strips out invalid properties', () => {
    const config = getValidatedProjectConfig({
      checks: {
        '*': [
          {
            name: 'foo',
            validate: () => true,
            fix: () => {},
            message: 'foo',
            foo: [],
          },
        ],
      },
      constraints: {
        '*': {
          allow: '*',
          disallow: '*',
          foo: [],
        },
        'tag-one': {
          allow: '*',
          disallow: ['tag-one'],
        },
        'tag-two': {
          disallow: ['tag-one'],
        },
        'tag-three': {
          allow: ['tag-one'],
        },
      },
      foo: [],
    });

    expect(config).toEqual({
      checks: {
        '*': [
          {
            name: 'foo',
            validate: expect.any(Function),
            fix: expect.any(Function),
            message: 'foo',
          },
        ],
      },
      constraints: {
        '*': {
          allow: '*',
          disallow: '*',
        },
        'tag-one': {
          allow: '*',
          disallow: ['tag-one'],
        },
        'tag-two': {
          disallow: ['tag-one'],
        },
        'tag-three': {
          allow: ['tag-one'],
        },
      },
    });
  });
});

describe('getProjectConfig', () => {
  describe('when run in an un-initialized project', () => {
    it('returns undefined', async () => {
      const rootDirectory = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures',
        'uninitialized',
      );

      const config = await getProjectConfig({ rootDirectory });

      expect(config).toEqual(undefined);
    });
  });

  describe('when run in an initialized project', () => {
    it('should return the parsed project config if the file exists and is valid', async () => {
      const rootDirectory = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures',
        'valid-project-config',
      );

      const config = await getProjectConfig({ rootDirectory });

      expect(config).toEqual({
        isEmpty: false,
        filepath: expect.stringContaining('commonality.config.ts'),
        config: {
          checks: {},
          constraints: {
            '*': {
              allow: '*',
            },
            config: {
              allow: ['config'],
            },
            ui: {
              allow: ['ui', 'utility', 'config'],
            },
            data: {
              allow: ['data', 'utility', 'config'],
            },
            utility: {
              allow: ['data', 'utility', 'config'],
            },
          },
        },
      });
    });
  });
});
