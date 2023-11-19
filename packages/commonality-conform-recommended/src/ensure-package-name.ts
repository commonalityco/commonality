import { defineConformer } from 'commonality';

export const ensurePackageName = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_PACKAGE_NAME',
  validate: ({ workspace }) => {
    if (!workspace.packageJson.name) {
      return false;
    }

    return true;
  },
  type: 'error' as const,
  message: () => ({
    title: 'Package name must be set in package.json',
    filepath: 'package.json',
  }),
}));
