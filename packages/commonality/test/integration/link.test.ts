import { afterAll, describe, test, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import os from 'node:os';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('link', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const configPath = path.join(temporaryPath, '.commonality/config.json');

  afterAll(async () => {
    await fs.remove(temporaryPath);
  });

  test('if there is no configuration file it creates a new project configuration with projectId', async () => {
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../test/fixtures/empty-project',
    );
    await fs.copy(fixturePath, temporaryPath);

    await execa(binPath, ['link', '--project', '123abc']);

    const configExists = await fs.exists(configPath);

    expect(configExists).toEqual(true);

    await expect(() => fs.readJson(configPath)).resolves.toEqual({
      projectId: '123abc',
    });
  });

  //   test('if there is a configuration file it updates it with a projectId without overwriting other properties', async () => {
  //     const fixturePath = path.resolve(
  //       path.dirname(fileURLToPath(import.meta.url)),
  //       '../../test/fixtures/with-configuration',
  //     );
  //     await fs.copy(fixturePath, temporaryPath);
  //   });
});
