import { findFirstExistingFile } from './find-first-existing-file';
import path from 'node:path';
import fs from 'fs-extra';

describe('findFirstExistingFile', () => {
  const testDirectory = path.join(__dirname, 'test-files');
  const existingFiles = ['file1.txt', 'file2.txt', 'file3.txt'];

  beforeAll(async () => {
    await fs.ensureDir(testDirectory);

    for (const file of existingFiles) {
      await fs.writeFile(path.join(testDirectory, file), 'test content');
    }
  });

  afterAll(async () => {
    await fs.remove(testDirectory);
  });

  test('should return the first existing file', async () => {
    const matchers = ['file1.txt', 'file2.txt', 'file3.txt'];
    const firstExistingFile = await findFirstExistingFile(matchers, {
      cwd: testDirectory,
    });

    expect(firstExistingFile).toEqual(path.join(testDirectory, 'file1.txt'));
  });

  test('should return undefined if no file exists', async () => {
    const matchers = ['nonexistent1.txt', 'nonexistent2.txt'];
    const firstExistingFile = await findFirstExistingFile(matchers, {
      cwd: testDirectory,
    });

    expect(firstExistingFile).toBeUndefined();
  });

  test('should return the correct existing file when files are missing', async () => {
    const matchers = ['nonexistent1.txt', 'file2.txt', 'nonexistent2.txt'];
    const firstExistingFile = await findFirstExistingFile(matchers, {
      cwd: testDirectory,
    });

    expect(firstExistingFile).toEqual(path.join(testDirectory, 'file2.txt'));
  });
});
