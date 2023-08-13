import { formatPackageName } from './format-package-name';
import { describe, expect, test } from 'vitest';

describe('when stripScope is true', () => {
  describe('when passed a package name', () => {
    test('returns the correct string', () => {
      const tagName = formatPackageName('@scope/foo-bar', {
        stripScope: true,
      });

      expect(tagName).toEqual('foo-bar');
    });
  });
});

describe('when stripScope is false', () => {
  describe('when passed a package name', () => {
    test('returns the correct string', () => {
      const tagName = formatPackageName('@scope/foo-bar', {
        stripScope: false,
      });

      expect(tagName).toEqual('@scope/foo-bar');
    });
  });
});
