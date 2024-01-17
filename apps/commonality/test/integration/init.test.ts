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

describe.concurrent('init', () => {
  it('shows an error if run outside a project', async () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

    const initProcess = execa(binPath, ['init', '--verbose'], {
      cwd: temporaryPath,
      stdout: 'pipe',
    });

    let initOutput = '';
    initProcess.stdout?.on('data', (data) => {
      console.log({ out: data.toString() });
      initOutput += stripAnsi(data.toString());
    });
    initProcess.stderr?.on('data', (data) => {
      console.log({ err: data.toString() });
      initOutput += stripAnsi(data.toString());
    });

    await vi.waitFor(
      () => {
        expect(initOutput).toContain(`Unable to find a lockfile`);
      },
      { timeout: 100_000 },
    );
  });

  describe.concurrent.each([
    {
      packageManager: 'pnpm',
      checkArgs: ['exec', 'commonality', 'check'],
      fixtureName: 'kitchen-sink',
    },
    {
      packageManager: 'yarn',
      checkArgs: ['exec', 'commonality', 'check'],
      fixtureName: 'kitchen-sink-yarn',
    },
    {
      packageManager: 'npm',
      checkArgs: ['exec', '--', 'commonality', 'check'],
      fixtureName: 'kitchen-sink-npm',
    },
  ])(
    'when the package manager is $packageManager',
    ({ packageManager, fixtureName, checkArgs }) => {
      it(
        'initializes a new project with TypeScript and checks',
        async () => {
          const temporaryDirectoryPath =
            process.env['RUNNER_TEMP'] || os.tmpdir();
          const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

          const fixturePath = path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            `../../test/fixtures/${fixtureName}`,
          );

          await fs.copy(fixturePath, temporaryPath);

          const initProcess = execa(binPath, ['init', '--verbose'], {
            cwd: temporaryPath,
            stdout: 'pipe',
          });

          let initOutput = '';
          initProcess.stdout?.on('data', (data) => {
            console.log({ out: data.toString() });
            initOutput += stripAnsi(data.toString());
          });
          initProcess.stderr?.on('data', (data) => {
            console.log({ err: data.toString() });
            initOutput += stripAnsi(data.toString());
          });

          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Would you like to use TypeScript?`);
            },
            { timeout: 100_000 },
          );

          initProcess.stdin?.write('\n');

          await vi.waitFor(
            () => {
              expect(initOutput).toContain(
                `Would you like to install our recommended checks?`,
              );
            },
            { timeout: 100_000 },
          );

          initProcess.stdin?.write('\n');

          await vi.waitFor(() => {
            expect(initOutput).toContain(`Installing commonality`);
          });
          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Installed commonality`);
            },
            { timeout: 200_000 },
          );

          await vi.waitFor(() => {
            expect(initOutput).toContain(
              `Installing commonality-checks-recommended`,
            );
          });
          await vi.waitFor(
            () => {
              expect(initOutput).toContain(
                `Installed commonality-checks-recommended`,
              );
            },
            { timeout: 200_000 },
          );

          await vi.waitFor(() => {
            expect(initOutput).toContain(`Creating commonality.config.ts`);
          });
          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Created commonality.config.ts`);
            },
            { timeout: 100_000 },
          );

          await vi.waitFor(() => {
            expect(initOutput).toContain(`You're all set up!`);
          });

          const configExists = await fs.exists(
            path.resolve(temporaryPath, 'commonality.config.ts'),
          );

          expect(configExists).toBe(true);

          const configContent = await fs.readFile(
            path.resolve(temporaryPath, 'commonality.config.ts'),
            'utf8',
          );

          expect(configContent).toMatch('commonality-checks-recommended');

          const checkProcess = execa(packageManager, checkArgs, {
            cwd: temporaryPath,
            stdout: 'pipe',
          });

          let checkOutput = '';
          checkProcess.stdout?.on('data', (data) => {
            console.log({ out: data.toString() });
            checkOutput += stripAnsi(data.toString());
          });
          checkProcess.stderr?.on('data', (data) => {
            console.log({ err: data.toString() });
            checkOutput += stripAnsi(data.toString());
          });

          await vi.waitFor(
            () => {
              expect(checkOutput).toContain(
                `Packages: 0 failed 1 warnings 0 passed (1)`,
              );
            },
            { timeout: 100_000 },
          );
        },
        { timeout: 200_000 },
      );

      it(
        'initializes a new project with JavaScript and no checks',
        async () => {
          const temporaryDirectoryPath =
            process.env['RUNNER_TEMP'] || os.tmpdir();
          const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

          const fixturePath = path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            `../../test/fixtures/${fixtureName}`,
          );

          await fs.copy(fixturePath, temporaryPath);

          const initProcess = execa(binPath, ['init', '--verbose'], {
            cwd: temporaryPath,
            stdout: 'pipe',
          });

          let initOutput = '';
          initProcess.stdout?.on('data', (data) => {
            console.log({ out: data.toString() });
            initOutput += stripAnsi(data.toString());
          });
          initProcess.stderr?.on('data', (data) => {
            console.log({ err: data.toString() });
            initOutput += stripAnsi(data.toString());
          });

          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Would you like to use TypeScript?`);
            },
            { timeout: 100_000 },
          );

          initProcess.stdin?.write('\u001B[D');
          initProcess.stdin?.write('\n');

          await vi.waitFor(
            () => {
              expect(initOutput).toContain(
                `Would you like to install our recommended checks?`,
              );
            },
            { timeout: 100_000 },
          );

          initProcess.stdin?.write('\u001B[D');
          initProcess.stdin?.write('\n');

          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Installing commonality`);
            },
            { timeout: 100_000 },
          );
          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Installed commonality`);
            },
            { timeout: 200_000 },
          );

          await vi.waitFor(() => {
            expect(initOutput).toContain(`Creating commonality.config.js`);
          });
          await vi.waitFor(
            () => {
              expect(initOutput).toContain(`Created commonality.config.js`);
            },
            { timeout: 100_000 },
          );

          await vi.waitFor(() => {
            expect(initOutput).toContain(`You're all set up!`);
          });

          const configExists = await fs.exists(
            path.resolve(temporaryPath, 'commonality.config.js'),
          );

          expect(configExists).toBe(true);

          const configContent = await fs.readFile(
            path.resolve(temporaryPath, 'commonality.config.js'),
            'utf8',
          );

          expect(configContent).toMatch(/checks: {}/);
          expect(configContent).not.toMatch(`commonality-checks-recommended`);

          const checkProcess = execa(packageManager, checkArgs, {
            cwd: temporaryPath,
            stdout: 'pipe',
          });

          let checkOutput = '';
          checkProcess.stdout?.on('data', (data) => {
            console.log({ out: data.toString() });
            checkOutput += stripAnsi(data.toString());
          });
          checkProcess.stderr?.on('data', (data) => {
            console.log({ err: data.toString() });
            checkOutput += stripAnsi(data.toString());
          });

          await vi.waitFor(
            () => {
              expect(checkOutput).toContain(
                `You don't have any checks configured.`,
              );
            },
            { timeout: 100_000 },
          );
        },
        { timeout: 200_000 },
      );
    },
  );
});
