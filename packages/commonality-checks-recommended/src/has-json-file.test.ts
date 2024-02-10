import { afterEach, describe, expect, it } from 'vitest';
import { hasJsonFile } from './has-json-file';
import { defineTestCheck, json } from 'commonality';
import mockFs from 'mock-fs';

describe('hasJsonFile', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if json file is not present', async () => {
      mockFs({});

      const check = defineTestCheck(hasJsonFile('missing.json'));

      const result = await check.validate();

      // @ts-expect-error expecting message object
      expect(result.message).toEqual(`File "missing.json" does not exist`);
    });

    it('should return true if json file is present without content', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = defineTestCheck(hasJsonFile('existing.json'));

      expect(await check.validate()).toBe(true);
    });

    it('should return false if json file is present but content does not match', async () => {
      mockFs({
        'existing.json': JSON.stringify({}),
      });

      const check = defineTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );

      const result = await check.validate();

      // @ts-expect-error expecting message object
      expect(result.message).toEqual(`File does not contain expected content`);
      // @ts-expect-error expecting message object
      expect(result.path).toEqual('existing.json');
      // @ts-expect-error expecting message object
      expect(result.suggestion).toMatchInlineSnapshot(`
        "  Object {}
        + Object {
        +   \\"key\\": \\"value\\",
        + }"
      `);
    });

    it('should return true if json file is present and content matches', async () => {
      mockFs({
        'existing.json': JSON.stringify({
          key: 'value',
          otherKey: 'otherValue',
        }),
      });

      const check = defineTestCheck(
        hasJsonFile('existing.json', { key: 'value' }),
      );

      expect(await check.validate()).toBe(true);
    });
  });

  describe('fix', () => {
    it('should not change the file if content is not provided', async () => {
      mockFs({
        'existing.json': JSON.stringify({ key: 'value' }),
      });

      const check = defineTestCheck(hasJsonFile('existing.json'));

      await check.fix();

      const fileContent = await json('./', 'existing.json').get();

      expect(fileContent).toEqual({ key: 'value' });
    });

    it('should merge the provided content into the existing file', async () => {
      mockFs({
        'existing.json': JSON.stringify({ foo: 'bar', key: 'old-value' }),
      });

      const check = defineTestCheck(
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
