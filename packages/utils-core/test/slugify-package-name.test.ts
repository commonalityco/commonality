import { slugifyPackageName } from './slugify-package-name';
import { describe, test, expect } from 'vitest';

describe('when the package name has a scope', () => {
  describe('when passed a package name with special characters', () => {
    test('returns the correct string', () => {
      const packageName = slugifyPackageName(
        '@scope/This is a @package name!  '
      );

      expect(packageName).toEqual('scope-this-is-a-package-name');
    });
  });
});

describe('when the package name does not have a scope', () => {
  describe('when passed a package name with special characters', () => {
    test('returns the correct string', () => {
      const packageName = slugifyPackageName('This is a @package name!  ');

      expect(packageName).toEqual('this-is-a-package-name');
    });
  });
});
