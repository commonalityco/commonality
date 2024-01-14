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

const runTest = async ({
  fixtureName,
  checkBin,
  checkArgs,
}: {
  fixtureName: string;
  checkBin: string;
  checkArgs: string[];
}) => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

  const fixturePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    `../../test/fixtures/${fixtureName}`,
  );

  await fs.copy(fixturePath, temporaryPath);

  const initProcess = execa(
    binPath,
    ['init', '--typescript', '--install-checks', '--verbose'],
    {
      cwd: temporaryPath,
      stdout: 'pipe',
    },
  );

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
        `Here are the changes we'll make to your project:`,
      );
    },
    { timeout: 20_000 },
  );

  await vi.waitFor(
    () => {
      expect(initOutput).toContain(`Would you like to proceed?`);
    },
    { timeout: 20_000 },
  );

  initProcess.stdin?.write('y\n');

  await vi.waitFor(() => {
    expect(initOutput).toContain(`Installing commonality`);
  });
  await vi.waitFor(
    () => {
      expect(initOutput).toContain(`Installed commonality`);
    },
    { timeout: 20_000 },
  );

  await vi.waitFor(() => {
    expect(initOutput).toContain(`Installing commonality-checks-recommended`);
  });
  await vi.waitFor(
    () => {
      expect(initOutput).toContain(`Installed commonality-checks-recommended`);
    },
    { timeout: 20_000 },
  );

  await vi.waitFor(() => {
    expect(initOutput).toContain(`Creating commonality.config.ts`);
  });
  await vi.waitFor(
    () => {
      expect(initOutput).toContain(`Created commonality.config.ts`);
    },
    { timeout: 20_000 },
  );

  await vi.waitFor(() => {
    expect(initOutput).toContain(`You're all set up!`);
  });

  const checkProcess = execa(checkBin, checkArgs, {
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
    { timeout: 20_000 },
  );
};

describe('init', () => {
  it(
    'pnpm - Initializes Commonality in a new project',
    () =>
      runTest({
        fixtureName: 'kitchen-sink',
        checkBin: 'pnpm',
        checkArgs: ['exec', 'commonality', 'check'],
      }),
    {
      timeout: 80_000,
    },
  );

  it(
    'yarn - Initializes Commonality in a new project',
    () =>
      runTest({
        fixtureName: 'kitchen-sink-yarn',
        checkBin: 'yarn',
        checkArgs: ['exec', 'commonality', 'check'],
      }),
    {
      timeout: 80_000,
    },
  );

  it(
    'npm - Initializes Commonality in a new project',
    () =>
      runTest({
        fixtureName: 'kitchen-sink-npm',
        checkBin: 'npm',
        checkArgs: ['exec', '--', 'commonality', 'check'],
      }),
    {
      timeout: 80_000,
    },
  );
});
