import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { createConfig } from './create-config';

describe('create-config', () => {
  it('creates a commonality.config.ts file when using TypeScript', async () => {
    mockFs({});

    await createConfig({ rootDirectory: './', typeScript: true });

    const exists = await fs.exists('./commonality.config.ts');

    expect(exists).toBe(true);
  });

  it('creates a commonality.config.js file when not using TypeScript', async () => {
    mockFs({});

    await createConfig({ rootDirectory: './', typeScript: false });

    const exists = await fs.exists('./commonality.config.js');

    expect(exists).toBe(true);
  });
});
