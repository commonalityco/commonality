import { validateProjectStructure } from '../src/utils/validate-project-structure.js';
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
import os from 'os';
import path from 'path';
import { copy, remove, mkdtempSync } from 'fs-extra';

describe('validateProjectStructure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when there is no lockfile', () => {
    const tmpDirPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../../test/fixtures/missing-lockfile',
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    it('should throw an error if no lockfile is detected', async () => {
      const command = new Command();
      const spy = vi
        .spyOn(command, 'error')
        .mockImplementation((() => {}) as any);

      await validateProjectStructure({
        directory: tempPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No lockfile detected'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when there is no root package', () => {
    const tmpDirPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../../test/fixtures/missing-root-package',
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    it('should throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');

      spy.mockImplementation((async () => {}) as any);

      await validateProjectStructure({
        directory: tempPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No valid root package detected'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when there is an invalid root package.json', () => {
    const tmpDirPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../../test/fixtures/invalid-root-package',
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    it('should throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');

      spy.mockImplementation((async () => {}) as any);

      await validateProjectStructure({
        directory: tempPath,
        command,
      });

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('No valid root package detected'),
        expect.objectContaining({ exitCode: 1 }),
      );
    });
  });

  describe('when running at the root of a valid project', () => {
    const tmpDirPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../../test/fixtures/kitchen-sink',
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    it('does not throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');
      const fixturePath = path.resolve(
        __dirname,
        '../../test/fixtures/kitchen-sink',
      );

      await validateProjectStructure({
        directory: fixturePath,
        command,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when running within a sub-directory of a valid project', () => {
    const tmpDirPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const tempPath = mkdtempSync(tmpDirPath);
    const fixturePath = path.resolve(
      __dirname,
      '../../test/fixtures/kitchen-sink/packages/pkg-one',
    );

    beforeEach(async () => {
      await copy(fixturePath, tempPath);
    });

    afterAll(async () => {
      await remove(tempPath);
    });

    it('does not throw an error', async () => {
      const command = new Command();
      const spy = vi.spyOn(command, 'error');
      const fixturePath = path.resolve(
        __dirname,
        '../../test/fixtures/kitchen-sink',
      );

      await validateProjectStructure({
        directory: fixturePath,
        command,
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
