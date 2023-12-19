import { describe, test, expect, beforeEach } from 'vitest';

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ExecaChildProcess, execa } from 'execa';
import os from 'node:os';
import { afterEach } from 'node:test';
import waitOn from 'wait-on';
import { Writable } from 'node:stream';
import killPort from 'kill-port';
import getPort from 'get-port';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

const waitFor = (
  fn: () => Promise<boolean> | boolean,
  interval: number = 1000,
) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const result = await fn();
        if (result) {
          clearInterval(intervalId);
          resolve(result);
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    }, interval);
  });
};

describe('studio', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  let preferredPort: number | undefined;
  let cliProcess: ExecaChildProcess | undefined;

  beforeEach(async () => {
    preferredPort = await getPort();
  });

  afterEach(async () => {
    cliProcess?.kill();

    await fs.remove(temporaryPath);
  });

  test(
    'logs the URL to open Commonality Studio',
    async () => {
      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/kitchen-sink',
      );
      await fs.copy(fixturePath, temporaryPath);

      cliProcess = execa(
        binPath,
        ['studio', '--debug', '--port', String(preferredPort)],
        {
          cwd: temporaryPath,
          stdout: 'pipe',
        },
      );

      let output = '';
      const stdoutMock = new Writable({
        write(chunk, encoding, callback) {
          output += chunk.toString();
          callback();
        },
      });

      cliProcess.stdout?.pipe(stdoutMock);

      await waitOn({
        resources: [`http://127.0.0.1:${preferredPort}`],
      });

      await waitFor(() => {
        return output.includes('📦 Starting Commonality Studio...');
      });

      expect(output).toContain('📦 Starting Commonality Studio...');

      await waitFor(() => {
        return output.includes(
          `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
        );
      });

      expect(output).toContain(
        `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
      );

      cliProcess.kill();

      await waitFor(() => {
        return output.includes(`Successfully exited Commonality Studio`);
      });

      expect(output).toContain(`Successfully exited Commonality Studio`);

      // await new Promise((resolve) => {
      //   setTimeout(() => resolve({}), 5000);
      // });

      // cliProcess.kill();

      // expect(stdoutMock).toBeCalledWith();

      // const expectedInstallText = `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`;

      // stdin.send('y\n');
      // stdin.end();

      // const { stdout } = await cliProcess;

      // expect(stdout).toMatchInlineSnapshot();
      // stdin.restore();
    },
    { timeout: 5000 },
  );
});
