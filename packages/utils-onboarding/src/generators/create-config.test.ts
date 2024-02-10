import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { createConfig } from './create-config';

describe('create-config', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('creates a .commonality/config.json file', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      includeChecks: true,
    });

    const exists = await fs.exists('.commonality/config.json');

    expect(exists).toBe(true);
  });

  it('creates a .commonality/config.json file with checks when includeChecks is true', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      includeChecks: true,
    });

    const content = await fs.readJSON('.commonality/config.json');

    expect(content).toEqual({
      $schema: 'https://commonality.co/config.json',
      checks: {
        '*': [
          'recommended/has-readme',
          'recommended/has-codeowner',
          'recommended/valid-package-name',
          'recommended/unique-dependency-types',
          'recommended/sorted-dependencies',
          'recommended/matching-dev-peer-versions',
          'recommended/consistent-external-version',
          'recommended/extends-repository-field',
        ],
      },
      constraints: {},
    });
  });

  it('creates a .commonality/config.json file without checks when includeChecks is false', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      includeChecks: false,
    });

    const content = await fs.readJSON('.commonality/config.json');

    expect(content).toEqual({
      $schema: 'https://commonality.co/config.json',
      checks: {},
      constraints: {},
    });
  });
});
