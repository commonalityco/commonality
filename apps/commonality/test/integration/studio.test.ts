import { describe, test, expect, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import os from 'node:os';
import getPort from 'get-port';
import stripAnsi from 'strip-ansi';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe.concurrent('studio', () => {
  test(
    'logs the URL to open Commonality Studio in a pnpm monorepo',
    async () => {
      const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
      const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
      const preferredPort = await getPort();

      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/kitchen-sink',
      );
      await fs.copy(fixturePath, temporaryPath);

      const cliProcess = exec(
        `${binPath} studio --debug --port ${String(preferredPort)} --install`,
        {
          cwd: temporaryPath,
        },
      );

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
          expect(output).toContain('📦 Starting Commonality Studio...');
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
          );
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 100_000 },
      );

      cliProcess.kill('SIGKILL');

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 200_000 },
  );

  test(
    'logs the URL to open Commonality Studio in an npm monorepo',
    async () => {
      const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
      const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
      const preferredPort = await getPort();

      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/kitchen-sink-npm',
      );
      await fs.copy(fixturePath, temporaryPath);

      const cliProcess = exec(
        `${binPath} studio --debug --port ${String(preferredPort)} --install`,
        {
          cwd: temporaryPath,
        },
      );

      let output = '';
      cliProcess.stdout?.on('data', (data) => {
        console.log('npm:', data.toString());
        output += stripAnsi(data.toString());
      });
      cliProcess.stderr?.on('data', (data) => {
        console.log('npm:', data.toString());
        output += stripAnsi(data.toString());
      });

      await vi.waitFor(
        () => {
          expect(output).toContain('📦 Starting Commonality Studio...');
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
          );
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 100_000 },
      );

      cliProcess.kill('SIGKILL');

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 200_000 },
  );

  test(
    'logs the URL to open Commonality Studio in a yarn monorepo',
    async () => {
      const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
      const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
      const preferredPort = await getPort();

      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../test/fixtures/kitchen-sink-yarn',
      );
      await fs.copy(fixturePath, temporaryPath);

      const cliProcess = exec(
        `${binPath} studio --debug --port ${String(preferredPort)} --install`,
        {
          cwd: temporaryPath,
        },
      );

      let output = '';
      cliProcess.stdout?.on('data', (data) => {
        console.log('yarn:', data.toString());
        output += stripAnsi(data.toString());
      });
      cliProcess.stderr?.on('data', (data) => {
        console.log('yarn:', data.toString());
        output += stripAnsi(data.toString());
      });

      await vi.waitFor(
        () => {
          expect(output).toContain('📦 Starting Commonality Studio...');
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
          );
        },
        { timeout: 50_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 100_000 },
      );

      cliProcess.kill('SIGKILL');

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 200_000 },
  );
});
