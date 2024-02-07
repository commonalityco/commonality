import { afterEach, describe, expect, it } from 'vitest';
import hasValidPackageName from './valid-package-name';
import { defineTestCheck } from 'commonality';
import mockFs from 'mock-fs';

describe('hasValidPackageName', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return a message object if package name is not present', async () => {
      mockFs({
        'package.json': JSON.stringify({}),
      });
      const conformer = defineTestCheck(hasValidPackageName);

      const result = await conformer.validate();

      // @ts-expect-error - expecting message object
      expect(result.message).toEqual('package.json is missing a name');
      // @ts-expect-error - expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error - expecting message object
      expect(result.suggestion).toEqual(undefined);
    });

    it('should return a message object if package name is invalid', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'workspace-namE',
        }),
      });

      const conformer = defineTestCheck(hasValidPackageName);

      const result = await conformer.validate();

      // @ts-expect-error - expecting message object
      expect(result.message).toEqual('Invalid package name');
      // @ts-expect-error - expecting message object
      expect(result.path).toEqual('package.json');
      // @ts-expect-error - expecting message object
      expect(result.suggestion).toMatchInlineSnapshot('"name can no longer contain capital letters"');
    });

    it('should return true if package name is present', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'workspace-name',
        }),
      });

      const conformer = defineTestCheck(hasValidPackageName);

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });
});
