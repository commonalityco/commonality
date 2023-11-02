import os from 'node:os';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import type { Workspace } from '@commonalityco/types';
import { createYaml } from '../src/yaml.js';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

describe.skip('createYaml', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const workspace: Workspace = {
    path: '/packages/pkg-one',
    packageJson: {
      workspaces: [],
      name: 'pkg-one',
      description: 'This is a test package',
      version: '1.0.0',
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
    },
  };

  const fixturePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    './fixtures/kitchen-sink',
  );

  beforeEach(async () => {
    await fs.copy(fixturePath, temporaryPath);
  });

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  describe('get', () => {
    it('should read YAML file', async () => {
      const yamlFile = createYaml({
        rootDirectory: temporaryPath,
        workspace,
      })('package.yaml');

      const yaml = await yamlFile.get('fakeToolConfig.generalSettings.theme');

      expect(yaml).toEqual('pkg-one');
    });
  });

  describe('set', () => {
    it('should set value in YAML file', async () => {
      const yamlFile = createYaml({
        rootDirectory: temporaryPath,
        workspace,
      })('package.yaml');

      await yamlFile.set('fakeToolConfig.property', 'hello');

      const yaml = await yamlFile.get('fakeToolConfig.property');

      expect(yaml).toEqual('hello');
    });
  });

  describe('remove', () => {
    it('should remove value from YAML file', async () => {
      const yamlFile = createYaml({
        rootDirectory: temporaryPath,
        workspace,
      })('package.yaml');

      await yamlFile.remove('workspaces');

      const yaml = await yamlFile.get('workspaces');

      expect(yaml).toEqual(undefined);
    });
  });
});
