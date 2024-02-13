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
  it('shows an error if run outside a project', async () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

    const initProcess = execa(binPath, ['init', '--verbose'], {
      cwd: temporaryPath,
      stdout: 'pipe',
      env: {
        DO_NOT_TRACK: '1',
      },
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

  describe.each([
    {
      fixtureName: 'kitchen-sink',
    },
    {
      fixtureName: 'kitchen-sink-yarn',
    },
    {
      fixtureName: 'kitchen-sink-npm',
    },
  ])('when the package manager is $packageManager', ({ fixtureName }) => {
    it(
      'initializes a new project with checks',
      async () => {
        const temporaryDirectoryPath =
          process.env['RUNNER_TEMP'] || os.tmpdir();
        const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

        const fixturePath = path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          `../../test/fixtures/${fixtureName}`,
        );

        await fs.copy(fixturePath, temporaryPath);
        await execa('corepack', ['install'], {
          cwd: temporaryPath,
        });
        const initProcess = execa(binPath, ['init', '--verbose'], {
          cwd: temporaryPath,
          stdout: 'pipe',
          env: {
            DO_NOT_TRACK: '1',
          },
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
          { timeout: 250_000 },
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
          { timeout: 250_000 },
        );

        await vi.waitFor(() => {
          expect(initOutput).toContain(`Creating .commonality/config.json`);
        });
        await vi.waitFor(
          () => {
            expect(initOutput).toContain(`Created .commonality/config.json`);
          },
          { timeout: 100_000 },
        );

        await vi.waitFor(() => {
          expect(initOutput).toContain(`You're all set up!`);
        });

        const configExists = await fs.exists(
          path.resolve(temporaryPath, '.commonality/config.json'),
        );

        expect(configExists).toBe(true);

        const configContent = await fs.readJSON(
          path.resolve(temporaryPath, '.commonality/config.json'),
        );

        expect(configContent).toEqual({
          $schema: 'https://commonality.co/config.json',
          checks: {
            '*': [
              'recommended/has-readme',
              'recommended/has-codeowner',
              'recommended/valid-package-name',
              'recommended/unique-dependency-types',
              'recommended/sorted-dependencies',
              'recommended/matching-dev-peer-versions',
              'recommended/consistent-external-version',
              'recommended/extends-repository-field',
            ],
          },
          constraints: {},
        });
      },
      { timeout: 250_000 },
    );

    it(
      'initializes a new project with no checks',
      async () => {
        const temporaryDirectoryPath =
          process.env['RUNNER_TEMP'] || os.tmpdir();
        const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

        const fixturePath = path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          `../../test/fixtures/${fixtureName}`,
        );

        await fs.copy(fixturePath, temporaryPath);
        await execa('corepack', ['install'], {
          cwd: temporaryPath,
        });

        const initProcess = execa(binPath, ['init', '--verbose'], {
          cwd: temporaryPath,
          stdout: 'pipe',
          env: {
            DO_NOT_TRACK: '1',
          },
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
          { timeout: 250_000 },
        );

        await vi.waitFor(() => {
          expect(initOutput).toContain(`Creating .commonality/config.json`);
        });
        await vi.waitFor(
          () => {
            expect(initOutput).toContain(`Created .commonality/config.json`);
          },
          { timeout: 100_000 },
        );

        await vi.waitFor(() => {
          expect(initOutput).toContain(`You're all set up!`);
        });

        const configExists = await fs.exists(
          path.resolve(temporaryPath, '.commonality/config.json'),
        );

        expect(configExists).toBe(true);

        const configContent = await fs.readJSON(
          path.resolve(temporaryPath, '.commonality/config.json'),
        );

        expect(configContent).toEqual({
          $schema: 'https://commonality.co/config.json',
          checks: {},
          constraints: {},
        });
      },
      { timeout: 250_000 },
    );
  });
});
