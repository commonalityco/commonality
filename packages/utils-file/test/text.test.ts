import os from 'node:os';
import stripAnsi from 'strip-ansi';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import { text } from '../src';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Workspace } from '@commonalityco/types';

describe('text', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);
  const workspace: Workspace = {
    path: '/packages/pkg-one',
    tags: [],
    codeowners: [],
    packageJson: {},
  };

  const fixturePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    './fixtures/kitchen-sink',
  );

  beforeEach(async () => {
    await fs.copy(fixturePath, temporaryPath);
  });

  afterEach(async () => {
    await fs.remove(temporaryPath);
  });

  describe('createTextFileReader', () => {
    it('should read text file', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'multi-line.md',
      );
      const textFile = text(filepath);
      const textData = await textFile.get();

      expect(textData).toEqual([
        '# First line',
        '## Second line',
        '### Third line',
      ]);
    });

    it('should return true if the file contains the lines', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'multi-line.md',
      );
      const textFile = text(filepath);

      await expect(
        textFile.contains(['# First line', '## Second line']),
      ).resolves.toEqual(true);
    });

    it('should return false if the file does not contain the lines', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'multi-line.md',
      );
      const textFile = text(filepath);

      await expect(textFile.contains(['line4', 'line5'])).resolves.toEqual(
        false,
      );
    });
  });

  describe('createTextFileWriter', () => {
    describe('set', () => {
      it('should write lines to text file', async () => {
        const filepath = path.join(
          temporaryPath,
          workspace.path,
          'multi-line.md',
        );
        const textFile = text(filepath);

        await textFile.set(['line1', 'line2', 'line3']);
        const textData = await fs.readFile(filepath, 'utf8');

        expect(textData).toMatchInlineSnapshot(`
          "line1
          line2
          line3"
        `);
      });
    });

    describe('add', () => {
      it('should add lines to text file', async () => {
        const filepath = path.join(
          temporaryPath,
          workspace.path,
          'multi-line.md',
        );
        const textFile = text(filepath);

        await textFile.add(['### Fourth line']);
        const textData = await fs.readFile(filepath, 'utf8');

        expect(textData).toMatchInlineSnapshot(`
          "# First line

          ## Second line

          ### Third line

          ### Fourth line"
        `);
      });
    });

    describe('remove', () => {
      it('should remove lines from text file', async () => {
        const filepath = path.join(
          temporaryPath,
          workspace.path,
          'multi-line.md',
        );
        const textFile = text(filepath);

        await textFile.remove(['### Third line']);

        const textData = await fs.readFile(filepath, 'utf8');

        expect(textData).toMatchInlineSnapshot(`
          "# First line

          ## Second line

          "
        `);
      });
    });
  });

  describe('createTextFileFormatter', () => {
    it('should return diff string when text is a subset of the value', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'multi-line.md',
      );
      const formatter = text(filepath);

      const value = [
        '# First line',
        '## Second line',
        '### Third line',
        '#### Fourth line',
      ];
      const result = await formatter.diff(value);

      expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
        "  # First line
          ## Second line
          ### Third line
        + #### Fourth line"
      `);
    });

    it('should return diff string when value is a subset of the text', async () => {
      const filepath = path.join(
        temporaryPath,
        workspace.path,
        'multi-line.md',
      );
      const formatter = text(filepath);

      const value = ['# First line', '## Second line'];
      const result = await formatter.diff(value);

      expect(stripAnsi(result ?? '')).toMatchInlineSnapshot(`
        "  # First line
          ## Second line"
      `);
    });
  });
});
