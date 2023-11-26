import { defineConformer } from 'commonality';
import validateNpmPackageName from 'validate-npm-package-name';

export const validPackageName = defineConformer(() => ({
  name: 'commonality/valid-package-name',
  validate: ({ workspace }) => {
    if (!workspace.packageJson.name) {
      return false;
    }

    const result = validateNpmPackageName(workspace.packageJson.name);

    const hasErrors = result.errors && result.errors.length > 0;
    const hasWarnings = result.warnings && result.warnings.length > 0;

    if (hasErrors || hasWarnings) {
      return false;
    }

    return true;
  },
  type: 'error',
  message: ({ workspace }) => {
    if (!workspace.packageJson.name) {
      return {
        title: 'Package name must be set in package.json',
        filepath: 'package.json',
      };
    }

    const result = validateNpmPackageName(workspace.packageJson.name);

    return {
      title: 'Invalid package name',
      filepath: 'package.json',
      context: result.errors
        ? result.errors.join('\n')
        : result.warnings?.join('\n'),
    };
  },
}));
