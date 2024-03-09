import { describe, test, expect, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import os from 'node:os';
import stripAnsi from 'strip-ansi';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('check', () => {
  test(
    'logs the URL to open Commonality Studio in a pnpm monorepo',
    async () => {
      const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
      const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/with-configuration',
      );
      await fs.copy(fixturePath, temporaryPath);

      const cliProcess = execa(binPath, ['check', '--debug'], {
        cwd: temporaryPath,
        stdout: 'pipe',
      });

      let output = '';

      cliProcess.stdout?.on('data', (data) => {
        console.log('pnpm:', data.toString());
        output += stripAnsi(data.toString());
      });
      cliProcess.stderr?.on('data', (data) => {
        console.log('pnpm:', data.toString());
        output += stripAnsi(data.toString());
      });

      await vi.waitFor(
        () => {
          expect(output).toContain('⚠ packages/pkg-two/package.json');
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain('✓ pkg-one (1)');
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Packages: 0 failed 0 warnings 1 passed (1)`,
          );
        },
        { timeout: 100_000 },
      );

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 200_000 },
  );
});
