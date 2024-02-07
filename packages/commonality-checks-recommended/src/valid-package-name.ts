import { PackageJson, json, Check } from 'commonality';
import validateNpmPackageName from 'validate-npm-package-name';

export default {
  level: 'error',
  message: 'package.json has a valid name',
  validate: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return { message: 'package.json is missing', path: 'package.json' };
    }

    if (!packageJson.name) {
      return {
        message: 'package.json is missing a name',
        path: 'package.json',
      };
    }

    const result = validateNpmPackageName(packageJson.name);

    const hasErrors = result.errors && result.errors.length > 0;
    const hasWarnings = result.warnings && result.warnings.length > 0;

    if (hasErrors || hasWarnings) {
      return {
        message: 'Invalid package name',
        path: 'package.json',
        suggestion: result.errors
          ? result.errors.join('\n')
          : result.warnings?.join('\n'),
      };
    }

    return true;
  },
} satisfies Check;
