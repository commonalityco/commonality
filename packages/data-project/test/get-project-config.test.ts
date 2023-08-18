import path from 'node:path';
import { getProjectConfig } from '../src/get-project-config';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

describe('getProjectConfig', () => {
  describe('when run in an un-initialized project', () => {
    it('returns an empty object', async () => {
      const rootDirectory = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures',
        'uninitialized',
      );

      const config = await getProjectConfig({ rootDirectory });

      expect(config).toEqual({});
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
        projectId: '123',
        constraints: [
          {
            applyTo: 'feature',
            allow: '*',
          },
          {
            applyTo: 'config',
            allow: ['config'],
          },
          {
            applyTo: 'ui',
            allow: ['ui', 'utility', 'config'],
          },
          {
            applyTo: 'data',
            allow: ['data', 'utility', 'config'],
          },
          {
            applyTo: 'utility',
            allow: ['data', 'utility', 'config'],
          },
        ],
      });
    });

    it('should return the parsed project config without invalid properties', async () => {
      const rootDirectory = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        './fixtures',
        'invalid-project-config',
      );

      await expect(getProjectConfig({ rootDirectory })).rejects.toThrow();
    });
  });
});
