import { PackageJson } from '@commonalityco/types';
import { diff } from '@commonalityco/utils-file';
import { defineConformer } from 'commonality';

function getExpectedPackageJson(packageJson: PackageJson) {
  const newPackageJson = JSON.parse(JSON.stringify(packageJson));

  const deps = newPackageJson.dependencies || {};
  const devDeps = newPackageJson.devDependencies || {};
  const optDeps = newPackageJson.optionalDependencies || {};

  // Remove from dependencies if in both devDependencies and optionalDependencies
  for (const dep in devDeps) {
    if (optDeps[dep]) {
      delete deps[dep];
    }
  }

  // Now update the newPackageJson dependencies
  if (Object.keys(deps).length > 0) {
    newPackageJson.dependencies = deps;
  }

  // Remove from devDependencies or optionalDependencies if also in dependencies
  for (const dep in deps) {
    if (devDeps[dep]) {
      delete devDeps[dep];
    }
    if (optDeps[dep]) {
      delete optDeps[dep];
    }
  }

  // Update the newPackageJson devDependencies and optionalDependencies
  if (Object.keys(devDeps).length > 0) {
    newPackageJson.devDependencies = devDeps;
  }
  if (Object.keys(optDeps).length > 0) {
    newPackageJson.optionalDependencies = optDeps;
  }

  return newPackageJson;
}

export const multipleDependencyTypes = defineConformer(() => {
  return {
    name: 'commonality/multiple-dependency-types',

    validate: async ({ json }) => {
      const { dependencies, devDependencies, optionalDependencies } =
        await json('package.json').get<PackageJson>();
      const multipleDependencyTypes = Object.keys(dependencies || {}).filter(
        (dep) =>
          (devDependencies && devDependencies[dep]) ||
          (optionalDependencies && optionalDependencies[dep]),
      );
      return multipleDependencyTypes.length === 0;
    },

    fix: async ({ json }) => {
      const packageJson = await json('package.json').get<PackageJson>();
      const newPackageJson = getExpectedPackageJson(packageJson);

      await json('package.json').set(newPackageJson);
    },

    message: async ({ json }) => {
      const packageJson = await json('package.json').get<PackageJson>();

      return {
        title:
          'A dependency should only be in one of dependencies, devDependencies, or optionalDependencies',
        filepath: 'package.json',
        context: diff(packageJson, getExpectedPackageJson(packageJson)),
      };
    },
  };
});
