import { afterEach, describe, expect, it } from 'vitest';
import { hasTextFile } from './has-text-file';
import { createTestCheck, text } from 'commonality';
import mockFs from 'mock-fs';

describe('hasTextFile', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if text file is not present', async () => {
      mockFs({});

      const check = createTestCheck(hasTextFile('missing.txt'));
      expect(await check.validate()).toBe(false);
    });

    it('should return true if text file is present without content', async () => {
      mockFs({
        'existing.txt': ' ',
      });

      const check = createTestCheck(hasTextFile('existing.txt'));

      expect(await check.validate()).toBe(true);
    });

    it('should return false if text file is present but content does not match', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(
        hasTextFile('existing.txt', ['Hello Universe']),
      );

      expect(await check.validate()).toBe(false);
    });

    it('should return true if text file is present and content matches', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(
        hasTextFile('existing.txt', ['Hello World']),
      );
      expect(await check.validate()).toBe(true);
    });
  });

  describe('message', () => {
    it('should return "Missing file" message if text file is not present', async () => {
      mockFs({});

      const check = createTestCheck(hasTextFile('missing.txt'));
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "File \\"missing.txt\\" does not exist",
        }
      `);
    });

    it('should return "exists" message if text file is present without content', async () => {
      mockFs({
        'existing.txt': ' ',
      });

      const check = createTestCheck(hasTextFile('existing.txt'));
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "existing.txt exists",
        }
      `);
    });

    it('should return "does not contain expected content" message if text file is present but content does not match', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(
        hasTextFile('existing.txt', ['Hello Universe']),
      );
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": "  Array [
            \\"Hello World\\",
        +   \\"Hello Universe\\",
          ]",
          "title": "\\"existing.txt\\" does not contain expected content",
        }
      `);
    });

    it('should return "exists" message if text file is present and content matches', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(
        hasTextFile('existing.txt', ['Hello World']),
      );
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "existing.txt exists",
        }
      `);
    });
  });

  describe('fix', () => {
    it('should not change the file if content is not provided', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(hasTextFile('existing.txt'));

      await check.fix();

      const fileContent = await text('./', 'existing.txt').get();

      expect(fileContent).toEqual(['Hello World']);
    });

    it('should append the content to the existing file', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = createTestCheck(
        hasTextFile('existing.txt', ['Hello Universe']),
      );
      await check.fix();

      const fileContent = await text('./', 'existing.txt').get();

      expect(fileContent).toEqual(['Hello World', 'Hello Universe']);
    });
  });
});
