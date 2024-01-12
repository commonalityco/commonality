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

describe('init', () => {
  it.only(
    'shows the default help information',
    async () => {
      const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
      const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/empty-project',
      );

      await fs.copy(fixturePath, temporaryPath);

      const cliProcess = execa(binPath, ['init'], {
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

      await vi.waitFor(() => {
        expect(output).toContain(`Would you like to use TypeScript?`);
      });

      cliProcess.stdin?.write('y\n');

      await vi.waitFor(() => {
        expect(output).toContain(
          `Would you like to install our recommended checks that help scale most monorepos?`,
        );
      });

      cliProcess.stdin?.write('y\n');

      await vi.waitFor(() => {
        expect(output).toContain(
          `Here are the changes we'll make to your project:`,
        );
      });

      cliProcess.stdin?.write('y\n');

      await vi.waitFor(() => {
        expect(output).toContain(`Installing commonality`);
      });
      await vi.waitFor(
        () => {
          expect(output).toContain(`Installed commonality`);
        },
        { timeout: 200_000 },
      );

      await vi.waitFor(() => {
        expect(output).toContain(`Installing commonality-checks-recommended`);
      });
      await vi.waitFor(
        () => {
          expect(output).toContain(`Installed commonality-checks-recommended`);
        },
        { timeout: 200_000 },
      );

      await vi.waitFor(() => {
        expect(output).toContain(`Creating commonality.config.ts`);
      });
      await vi.waitFor(
        () => {
          expect(output).toContain(`Created commonality.config.ts`);
        },
        { timeout: 200_000 },
      );

      await vi.waitFor(() => {
        expect(output).toContain(`You're all set up!`);
      });
    },
    { timeout: 200_000 },
  );
});
