import { afterEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import { text } from './text';
import mock from 'mock-fs';

const content = `# First line\n## Second line\n### Third line\n`;

const filename = 'content.md';

describe('text', () => {
  afterEach(() => {
    mock.restore();
  });

  describe('get', () => {
    it('should return the lines for the text file', async () => {
      mock({
        [filename]: content,
      });
      const lines = await text('./', filename).get();

      expect(lines).toEqual([
        '# First line',
        '## Second line',
        '### Third line',
        '',
      ]);
    });

    it('should return undefined if the file does not exist', async () => {
      mock({});
      const lines = await text('./', filename).get();

      expect(lines).toEqual(undefined);
    });
  });

  describe('contains', () => {
    it('should return true if the file contains the line', async () => {
      mock({
        [filename]: content,
      });

      const result = await text('./', filename).contains(['# First line']);

      expect(result).toEqual(true);
    });

    it('should return false if the file does not contain the line', async () => {
      mock({
        [filename]: content,
      });

      const result = await text('./', filename).contains(['# Fourth line']);

      expect(result).toEqual(false);
    });

    it('should return false if the file does exist', async () => {
      mock({});

      const result = await text('./', filename).contains(['# Fourth line']);

      expect(result).toEqual(false);
    });
  });

  describe('set', () => {
    it('should overwrite all lines to text file', async () => {
      mock({
        [filename]: content,
      });

      await text('./', filename).set(['line1', 'line2', 'line3']);

      const textData = await fs.readFile(filename, 'utf8');

      expect(textData).toMatchInlineSnapshot(`
        "line1
        line2
        line3"
      `);
    });

    it('should write lines to text file if it does not exist', async () => {
      mock({});

      await text('./', filename).set(['line1', 'line2', 'line3']);

      const textData = await fs.readFile(filename, 'utf8');

      expect(textData).toMatchInlineSnapshot(`
        "line1
        line2
        line3"
      `);
    });
  });

  describe('add', () => {
    it('should add lines to text file', async () => {
      mock({
        [filename]: content,
      });

      await text('./', filename).add(['### Fourth line']);

      const textData = await fs.readFile(filename, 'utf8');

      expect(textData).toMatchInlineSnapshot(`
        "# First line
        ## Second line
        ### Third line

        ### Fourth line"
      `);
    });

    it('should add lines to text file if it does not exist', async () => {
      mock({});

      await text('./', filename).add(['### Fourth line']);

      const textData = await fs.readFile(filename, 'utf8');

      expect(textData).toMatchInlineSnapshot('"### Fourth line"');
    });
  });

  describe('remove', () => {
    it('should remove lines from text file', async () => {
      mock({
        [filename]: content,
      });

      await text('./', filename).remove(['### Third line']);

      const textData = await fs.readFile(filename, 'utf8');

      expect(textData).toMatchInlineSnapshot(`
        "# First line
        ## Second line
        "
      `);
    });

    it('should not throw if file does not exist', async () => {
      mock({});

      await expect(
        text('./', filename).remove(['### Third line']),
      ).resolves.toEqual(undefined);
    });
  });
});
