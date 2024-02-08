import { validateProjectStructure } from './validate-project-structure.js';
import { Command } from 'commander';
import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  afterAll,
  beforeEach,
} from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';

const consoleMock = {
  log: vi.fn(),
};

describe('validateProjectStructure', () => {
  beforeEach(() => {
    vi.stubGlobal('console', consoleMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when there is no lockfile', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/missing-lockfile',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('should throw an error if no lockfile is detected', async () => {
      const command = new Command();
      const spy = vi
        .spyOn(command, 'error')
        .mockImplementation((() => {}) as unknown as typeof command.error);

      await validateProjectStructure({
        directory: temporaryPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No lockfile detected'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when there is no root package', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/missing-root-package',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('should throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');

      spy.mockImplementation(
        (async () => {}) as unknown as typeof command.error,
      );

      await validateProjectStructure({
        directory: temporaryPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No root package.json detected'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when there is an invalid root package.json', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/invalid-root-package',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('should throw an error', async () => {
      const command = new Command();
      const spy = vi
        .spyOn(command, 'error')
        .mockImplementation(
          (async () => {}) as unknown as typeof command.error,
        );

      await validateProjectStructure({
        directory: temporaryPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No "name" detected in root package.json'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when running at the root of a valid project', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/kitchen-sink',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('does not throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');
      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../../test/fixtures/kitchen-sink',
      );

      await validateProjectStructure({
        directory: fixturePath,
        command,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('displays a warning for skipped packages', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/kitchen-sink',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('does not throw an error', async () => {
      const command = new Command();
      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../../test/fixtures/kitchen-sink',
      );

      await validateProjectStructure({
        directory: fixturePath,
        command,
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('⚠ packages/pkg-two/package.json'),
      );
    });
  });

  describe('when running within a sub-directory of a valid project', () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
    const fixturePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../test/fixtures/kitchen-sink/packages/pkg-one',
    );

    beforeEach(async () => {
      await fs.copy(fixturePath, temporaryPath);
    });

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    it('does not throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');
      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../../test/fixtures/kitchen-sink',
      );

      await validateProjectStructure({
        directory: fixturePath,
        command,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
