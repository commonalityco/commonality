import { describe, test, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import os from 'node:os';
import { afterEach } from 'node:test';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('open', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  test('logs the URL to open Commonality Studio', async (done) => {
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../test/fixtures/kitchen-sink',
    );
    await fs.copy(fixturePath, temporaryPath);

    const serverProcess = execa(binPath, ['open', '--debug'], {
      cwd: temporaryPath,
    });

    const expectedText = 'Viewable at: http://127.0.0.1';

    return new Promise((resolve, reject) => {
      if (!serverProcess?.stdout) {
        return reject('No stdout for process');
      }

      serverProcess?.stdout?.on('data', (data) => {
        const output = data.toString();

        if (output.includes(expectedText)) {
          // Step 3: Assert the log
          expect(output).toContain(expectedText);

          // Step 4: Cleanup - kill the server process
          serverProcess.kill();

          // Signal that the test is complete
          return resolve({});
        }
      });
    });
  });
});
