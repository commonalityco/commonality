import { PackageJson } from '@commonalityco/types';
import { diff } from '@commonalityco/utils-file';
import { defineConformer } from 'commonality';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
] as const;

const sortObjectKeys = (obj: Record<string, string>) => {
  return obj ? Object.fromEntries(Object.entries(obj).sort()) : {};
};

const getExpectedPackageJson = (packageJson: PackageJson) => {
  const newPackageJson = JSON.parse(JSON.stringify(packageJson));

  for (const depType of DEPENDENCY_TYPES) {
    const deps = newPackageJson[depType];

    if (deps) {
      const sortedDeps = sortObjectKeys(deps);
      const originalKeys = Object.keys(deps);
      const sortedKeys = Object.keys(sortedDeps);
      const hasSortedKeys = sortedKeys.every(
        (value, index) => value === originalKeys[index],
      );

      if (!hasSortedKeys) {
        newPackageJson[depType] = sortedDeps;
      }
    }
  }

  return newPackageJson;
};

export const sortedDependencies = defineConformer(() => {
  return {
    name: 'commonality/ensure-sorted-dependencies',
    validate: async ({ json }) => {
      const packageJson = await json('package.json').get<PackageJson>();

      return DEPENDENCY_TYPES.every((depType) => {
        const deps = packageJson[depType] ?? {};
        const sortedKeys = Object.keys(sortObjectKeys(deps));
        const originalKeys = Object.keys(deps);
        const hasSortedKeys = sortedKeys.every(
          (value, index) => value === originalKeys[index],
        );

        return deps && hasSortedKeys;
      });
    },
    fix: async ({ json }) => {
      const packageJson = await json('package.json').get<PackageJson>();
      const expectedPackageJson = getExpectedPackageJson(packageJson);

      await json('package.json').set(expectedPackageJson);
    },
    message: () => {
      return {
        title: 'Dependencies in package.json must be sorted alphabetically',
        filepath: 'package.json',
      };
    },
  };
});
