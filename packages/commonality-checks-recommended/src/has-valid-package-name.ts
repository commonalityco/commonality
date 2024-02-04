import { PackageJson, json, Check } from 'commonality';
import validateNpmPackageName from 'validate-npm-package-name';

export default {
  name: 'commonality/has-valid-package-name',
  level: 'error',
  validate: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
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
  message: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
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
} satisfies Check;
