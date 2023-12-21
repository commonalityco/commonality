import { defineCheck, PackageJson, json } from 'commonality';
import validateNpmPackageName from 'validate-npm-package-name';

export const validPackageName = defineCheck(() => ({
  name: 'commonality/valid-package-name',
  validate: async ({ workspace }) => {
    const packageJson = await json<PackageJson>(
      workspace.path,
      'package.json',
    ).get();

    if (!packageJson || !packageJson.name) {
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
  message: async ({ workspace }) => {
    const packageJson = await json<PackageJson>(
      workspace.path,
      'package.json',
    ).get();

    if (!packageJson || !packageJson.name) {
      return {
        title: 'Package name must be set in package.json',
        filePath: 'package.json',
      };
    }

    const result = validateNpmPackageName(packageJson.name);

    return {
      title: 'Invalid package name',
      filePath: 'package.json',
      suggestion: result.errors
        ? result.errors.join('\n')
        : result.warnings?.join('\n'),
    };
  },
}));
