import path from 'node:path';
import fs from 'fs-extra';
import { tmpdir } from 'node:os';
import { describe, expect, beforeEach, afterEach, it } from '@jest/globals';
import { getRootDirectory } from './get-root-directory';

const temporaryDirectory = path.join(tmpdir(), 'get-root-directory');

describe('getRootDirectory', () => {
  describe('when the package manager is pnpm', () => {
    beforeEach(async () => {
      const fixturePath = path.join(
        path.resolve(__dirname, '../../test/fixtures'),
        'pnpm-workspace'
      );
      await fs.copy(fixturePath, temporaryDirectory);
    });

    afterEach(async () => {
      await fs.remove(temporaryDirectory);
    });

    it('returns the root directory of the monorepo', async () => {
      const rootDirectory = await getRootDirectory(temporaryDirectory);

      expect(rootDirectory).toEqual(temporaryDirectory);
    });
  });

  describe('when the package manager is yarn', () => {
    beforeEach(async () => {
      const fixturePath = path.join(
        path.resolve(__dirname, '../../test/fixtures'),
        'yarn-workspace'
      );
      await fs.copy(fixturePath, temporaryDirectory);
    });

    afterEach(async () => {
      await fs.remove(temporaryDirectory);
    });

    it('returns the root directory of the monorepo', async () => {
      const rootDirectory = await getRootDirectory(temporaryDirectory);

      expect(rootDirectory).toEqual(temporaryDirectory);
    });
  });

  describe('when the package manager is yarn', () => {
    beforeEach(async () => {
      const fixturePath = path.join(
        path.resolve(__dirname, '../../test/fixtures'),
        'npm-workspace'
      );
      await fs.copy(fixturePath, temporaryDirectory);
    });

    afterEach(async () => {
      await fs.remove(temporaryDirectory);
    });

    it('returns the root directory of the monorepo', async () => {
      const rootDirectory = await getRootDirectory(temporaryDirectory);

      expect(rootDirectory).toEqual(temporaryDirectory);
    });
  });
});
