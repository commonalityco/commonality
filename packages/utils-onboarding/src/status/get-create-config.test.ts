import { describe, test, expect, afterEach } from 'vitest';
import mockFs from 'mock-fs';
import { getCreateConfig } from './get-create-config';

describe('getCreateConfig', () => {
  afterEach(() => {
    mockFs.restore();
  });

  test('returns true if commonality.config.ts exists', async () => {
    mockFs({
      'commonality.config.ts': '',
    });

    const result = await getCreateConfig({ rootDirectory: './' });

    expect(result).toEqual(false);
  });

  test('returns true if commonality.config.js exists', async () => {
    mockFs({
      'commonality.config.ts': '',
    });

    const result = await getCreateConfig({ rootDirectory: './' });

    expect(result).toEqual(false);
  });

  test('returns false if no config file exists', async () => {
    mockFs({});

    const result = await getCreateConfig({ rootDirectory: './' });

    expect(result).toEqual(true);
  });
});
