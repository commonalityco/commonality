import mock from 'mock-fs';
import { getRootDirectory } from './getRootDirectory';
import path from 'path';

describe('getRootDirectory', () => {
  describe('when the package manager is pnpm', () => {
    beforeEach(() => {
      console.log('');
      mock({
        'test-root/pnpm-lock.yaml': '',
      });
    });

    afterEach(mock.restore);

    it('returns the root directory of the monorepo', async () => {
      const testRootPath = path.resolve(process.cwd(), 'test-root');
      const rootDirectory = await getRootDirectory(testRootPath);

      expect(rootDirectory).toEqual(testRootPath);
    });
  });

  describe('when the package manager is yarn', () => {
    beforeEach(() => {
      console.log('');
      mock({
        'test-root/yarn.lock': '',
      });
    });

    afterEach(mock.restore);

    it('returns the root directory of the monorepo', async () => {
      const testRootPath = path.resolve(process.cwd(), 'test-root');
      const rootDirectory = await getRootDirectory(testRootPath);

      expect(rootDirectory).toEqual(testRootPath);
    });
  });

  describe('when the package manager is yarn', () => {
    beforeEach(() => {
      console.log('');
      mock({
        'test-root/package-lock.json': '',
      });
    });

    afterEach(mock.restore);

    it('returns the root directory of the monorepo', async () => {
      const testRootPath = path.resolve(process.cwd(), 'test-root');
      const rootDirectory = await getRootDirectory(testRootPath);

      expect(rootDirectory).toEqual(testRootPath);
    });
  });
});
