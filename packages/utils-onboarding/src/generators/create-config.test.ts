import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { createConfig } from './create-config';

describe('create-config', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('creates a commonality.config.ts file when using TypeScript', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      typeScript: true,
      includeChecks: true,
    });

    const exists = await fs.exists('./commonality.config.ts');

    expect(exists).toBe(true);
  });

  it('creates a commonality.config.js file when not using TypeScript', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      typeScript: false,
      includeChecks: true,
    });

    const exists = await fs.exists('./commonality.config.js');

    expect(exists).toBe(true);
  });

  it('creates a commonality.config.ts file with checks when includeChecks is true', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      typeScript: true,
      includeChecks: true,
    });

    const content = await fs.readFile('./commonality.config.ts', 'utf8');

    expect(content).toMatchInlineSnapshot(`
      "import { defineConfig } from 'commonality';
      import * as recommended from 'commonality-checks-recommended';

      export default defineConfig({
        checks: {
          '*': [
            recommended.hasReadme(),
            recommended.hasCodeowner(),
            recommended.hasValidPackageName(),
            recommended.hasUniqueDependencyTypes(),
            recommended.hasSortedDependencies(),
            recommended.hasMatchingDevPeerVersions(),
            recommended.hasConsistentExternalVersion(),
            recommended.extendsRepositoryField(),
          ],
        },
        constraints: {},
      });"
    `);
  });

  it('creates a commonality.config.ts file without checks when includeChecks is false', async () => {
    mockFs({});

    await createConfig({
      rootDirectory: './',
      typeScript: true,
      includeChecks: false,
    });

    const content = await fs.readFile('./commonality.config.ts', 'utf8');

    expect(content).toMatchInlineSnapshot(`
      "import { defineConfig } from 'commonality';

      export default defineConfig({
        checks: {},
        constraints: {},
      });"
    `);
  });
});
