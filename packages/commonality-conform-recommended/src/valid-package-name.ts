import { PackageJson } from '@commonalityco/types';
import { defineConformer } from 'commonality';
import validateNpmPackageName from 'validate-npm-package-name';

export const validPackageName = defineConformer(() => ({
  name: 'commonality/valid-package-name',
  validate: async ({ json }) => {
    const packageJson = await json('package.json').get<PackageJson>();

    if (!packageJson.name) {
      return false;
    }

    const result = validateNpmPackageName(packageJson.name);

    const hasErrors = result.errors && result.errors.length > 0;
    const hasWarnings = result.warnings && result.warnings.length > 0;

    if (hasErrors || hasWarnings) {
      return false;
    }

    return true;
  },
  type: 'error',
  message: async ({ json }) => {
    const packageJson = await json('package.json').get<PackageJson>();

    if (!packageJson.name) {
      return {
        title: 'Package name must be set in package.json',
        filepath: 'package.json',
      };
    }

    const result = validateNpmPackageName(packageJson.name);

    return {
      title: 'Invalid package name',
      filepath: 'package.json',
      context: result.errors
        ? result.errors.join('\n')
        : result.warnings?.join('\n'),
    };
  },
}));
