import { afterEach, describe, expect, it } from 'vitest';
import { hasJsonFile } from './has-json-file';
import { createTestCheck, json } from 'commonality';
import mockFs from 'mock-fs';

describe('hasJsonFile', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if json file is not present', async () => {
      mockFs({});

      const check = createTestCheck(hasJsonFile('missing.json'));
      expect(await check.validate()).toBe(false);
    });

    it('should return true if json file is present without content', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = createTestCheck(hasJsonFile('existing.json'));

      expect(await check.validate()).toBe(true);
    });

    it('should return false if json file is present but content does not match', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = createTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );

      expect(await check.validate()).toBe(false);
    });

    it('should return true if json file is present and content matches', async () => {
      mockFs({
        'existing.json': JSON.stringify({
          key: 'value',
          otherKey: 'otherValue',
        }),
      });

      const check = createTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );
      expect(await check.validate()).toBe(true);
    });
  });

  describe('message', () => {
    it('should return "Missing file" message if json file is not present', async () => {
      mockFs({});

      const check = createTestCheck(hasJsonFile('missing.json'));
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "File \\"missing.json\\" does not exist",
        }
      `);
    });

    it('should return "exists" message if json file is present without content', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = createTestCheck(hasJsonFile('existing.json'));
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "existing.json exists",
        }
      `);
    });

    it('should return "does not contain expected content" message if json file is present but content does not match', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = createTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": "  Object {}
        + Object {
        +   \\"key\\": \\"value\\",
        + }",
          "title": "\\"existing.json\\" does not contain expected content",
        }
      `);
    });

    it('should return "exists" message if json file is present and content matches', async () => {
      mockFs({
        'existing.json': JSON.stringify({
          key: 'value',
          otherKey: 'otherValue',
        }),
      });

      const check = createTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );
      expect(await check.message()).toMatchInlineSnapshot(`
        {
          "suggestion": undefined,
          "title": "existing.json exists",
        }
      `);
    });
  });

  describe('fix', () => {
    it('should not change the file if content is not provided', async () => {
      mockFs({
        'existing.json': JSON.stringify({ key: 'value' }),
      });

      const check = createTestCheck(hasJsonFile('existing.json'));

      await check.fix();

      const fileContent = await json('./', 'existing.json').get();

      expect(fileContent).toEqual({ key: 'value' });
    });

    it('should merge the provided content into the existing file', async () => {
      mockFs({
        'existing.json': JSON.stringify({ foo: 'bar', key: 'old-value' }),
      });

      const check = createTestCheck(
        hasJsonFile('existing.json', { key: 'new-value' }),
      );
      await check.fix();

      const fileContent = await json('./', 'existing.json').get();

      expect(fileContent).toEqual({
        key: 'new-value',
        foo: 'bar',
      });
    });
  });
});
