import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { execa } from 'execa';
import stripAnsi from 'strip-ansi';
import os from 'node:os';
import fs from 'fs-extra';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('smoke', () => {
  it('shows the default help information', async () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../test/fixtures/kitchen-sink',
    );

    await fs.copy(fixturePath, temporaryPath);

    const cliProcess = execa(binPath, {
      cwd: temporaryPath,
      stdout: 'pipe',
    });

    let output = '';
    cliProcess.stdout?.on('data', (data) => {
      console.log({ out: data.toString() });
      output += stripAnsi(data.toString());
    });
    cliProcess.stderr?.on('data', (data) => {
      console.log({ err: data.toString() });
      output += stripAnsi(data.toString());
    });

    await vi.waitFor(
      () => {
        expect(output).toContain('Infinitely scalable front-end ecosystems');
      },
      { timeout: 20_000 },
    );
  });
});
