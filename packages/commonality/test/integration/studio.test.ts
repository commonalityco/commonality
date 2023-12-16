import { describe, test, vi, expect } from 'vitest';

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

describe('studio', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  test('logs the URL to open Commonality Studio', async () => {
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../test/fixtures/kitchen-sink',
    );
    await fs.copy(fixturePath, temporaryPath);

    vi.spyOn(process.stdout, 'write');

    const cliProcess = execa(binPath, ['studio', '--debug'], {
      cwd: temporaryPath,
      stdout: 'pipe',
    });

    setTimeout(() => {
      cliProcess.stdin?.write(`y\n`);
      cliProcess.stdin?.end();
    }, 0);

    const { stdout } = await cliProcess;

    console.log({ stdout });

    // expect(stdoutMock).toBeCalledWith();

    // for await (const chunk of cliProcess?.stdout) {
    //   console.log(chunk.toString());
    // }

    // const expectedInstallText = `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`;

    // stdin.send('y\n');
    // stdin.end();

    // const { stdout } = await cliProcess;

    // expect(stdout).toMatchInlineSnapshot();
    // stdin.restore();
  });
});
