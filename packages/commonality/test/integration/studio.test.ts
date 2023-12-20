import { describe, test, expect, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import os from 'node:os';
import { Writable } from 'node:stream';
import getPort from 'get-port';
import stripAnsi from 'strip-ansi';

const binPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../bin.js',
);

describe('studio', () => {
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

      const cliProcess = execa(
        binPath,
        ['studio', '--debug', '--port', String(preferredPort), '--install'],
        {
          cwd: temporaryPath,
          stdout: 'overlapped',
        },
      );

      let output = '';
      const stdoutMock = new Writable({
        write(chunk, encoding, callback) {
          output += stripAnsi(chunk.toString());
          callback();
        },
      });

      cliProcess.stdout?.pipe(stdoutMock);
      cliProcess.stderr?.pipe(stdoutMock);

      await vi.waitFor(() => {
        expect(output).toContain('📦 Starting Commonality Studio...');
      });

      await vi.waitFor(() => {
        expect(output).toContain(
          `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
        );
      });

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 20_000 },
      );

      cliProcess.kill('SIGTERM', {
        forceKillAfterTimeout: 2000,
      });

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 50_000 },
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

      const cliProcess = execa(
        binPath,
        ['studio', '--debug', '--port', String(preferredPort), '--install'],
        {
          cwd: temporaryPath,
          stdout: 'pipe',
        },
      );

      let output = '';
      const stdoutMock = new Writable({
        write(chunk, encoding, callback) {
          output += stripAnsi(chunk.toString());
          callback();
        },
      });

      cliProcess.stdout?.pipe(stdoutMock);
      cliProcess.stderr?.pipe(stdoutMock);

      await vi.waitFor(() => {
        expect(output).toContain('📦 Starting Commonality Studio...');
      });

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
          );
        },
        { timeout: 20_000 },
      );

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 20_000 },
      );

      cliProcess.kill('SIGTERM', {
        forceKillAfterTimeout: 2000,
      });

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 50_000 },
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

      const cliProcess = execa(
        binPath,
        ['studio', '--debug', '--port', String(preferredPort), '--install'],
        {
          cwd: temporaryPath,
          stdout: 'pipe',
        },
      );

      let output = '';
      const stdoutMock = new Writable({
        write(chunk, encoding, callback) {
          output += stripAnsi(chunk.toString());
          callback();
        },
      });

      cliProcess.stdout?.pipe(stdoutMock);
      cliProcess.stderr?.pipe(stdoutMock);

      await vi.waitFor(() => {
        expect(output).toContain('📦 Starting Commonality Studio...');
      });

      await vi.waitFor(() => {
        expect(output).toContain(
          `MISSING DEPENDENCY  Cannot find dependency '@commonalityco/studio'`,
        );
      });

      await vi.waitFor(
        () => {
          expect(output).toContain(
            `Viewable at: http://127.0.0.1:${preferredPort} (press ctrl-c to quit)`,
          );
        },
        { timeout: 20_000 },
      );

      cliProcess.kill('SIGTERM', {
        forceKillAfterTimeout: 2000,
      });

      await vi.waitFor(() => {
        expect(output).toContain(`Successfully exited Commonality Studio`);
      });

      cliProcess?.kill();

      await fs.remove(temporaryPath);
    },
    { timeout: 50_000 },
  );
});
