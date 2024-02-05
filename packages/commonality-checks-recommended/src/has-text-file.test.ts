import { afterEach, describe, expect, it } from 'vitest';
import { hasTextFile } from './has-text-file';
import { defineTestCheck, text } from 'commonality';
import mockFs from 'mock-fs';

describe('hasTextFile', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if text file is not present', async () => {
      mockFs({});

      const check = defineTestCheck(hasTextFile('missing.txt'));

      const result = await check.validate();

      // @ts-expect-error expecting message object
      expect(result.message).toEqual(`File "missing.txt" does not exist`);
      // @ts-expect-error expecting message object
      expect(result.path).toEqual('missing.txt');
      // @ts-expect-error expecting message object
      expect(result.suggestion).toEqual(undefined);
    });

    it('should return true if text file is present without content', async () => {
      mockFs({
        'existing.txt': ' ',
      });

      const check = defineTestCheck(hasTextFile('existing.txt'));

      expect(await check.validate()).toBe(true);
    });

    it('should return false if text file is present but content does not match', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = defineTestCheck(
        hasTextFile('existing.txt', ['Hello Universe']),
      );

      const result = await check.validate();

      // @ts-expect-error expecting message object
      expect(result.message).toEqual('File does not contain expected content');
      // @ts-expect-error expecting message object
      expect(result.path).toEqual('existing.txt');
      // @ts-expect-error expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Array [
            \\"Hello World\\",
        +   \\"Hello Universe\\",
          ]"
      `);
    });

    it('should return true if text file is present and content matches', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = defineTestCheck(
        hasTextFile('existing.txt', ['Hello World']),
      );
      expect(await check.validate()).toBe(true);
    });
  });

  describe('fix', () => {
    it('should not change the file if content is not provided', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = defineTestCheck(hasTextFile('existing.txt'));

      await check.fix();

      const fileContent = await text('./', 'existing.txt').get();

      expect(fileContent).toEqual(['Hello World']);
    });

    it('should append the content to the existing file', async () => {
      mockFs({
        'existing.txt': 'Hello World',
      });

      const check = defineTestCheck(
        hasTextFile('existing.txt', ['Hello Universe']),
      );
      await check.fix();

      const fileContent = await text('./', 'existing.txt').get();

      expect(fileContent).toEqual(['Hello World', 'Hello Universe']);
    });
  });
});
