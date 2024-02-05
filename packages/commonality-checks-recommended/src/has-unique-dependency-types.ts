import { Check, diff, json, PackageJson } from 'commonality';

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

export default {
  name: 'commonality/has-unique-dependency-types',
  level: 'warning',
  message:
    'A dependency should only be in one of dependencies, devDependencies, or optionalDependencies',
  validate: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson && !packageJson) {
      return { message: 'package.json is missing' };
    }

    const { dependencies, devDependencies, optionalDependencies } = packageJson;

    const hasUniqueDependencyTypes = Object.keys(dependencies || {}).filter(
      (dep) =>
        (devDependencies && devDependencies[dep]) ||
        (optionalDependencies && optionalDependencies[dep]),
    );

    if (hasUniqueDependencyTypes.length > 0) {
      return {
        path: 'package.json',
        suggestion: diff(packageJson, getExpectedPackageJson(packageJson)),
      };
    }

    return true;
  },

  fix: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return;
    }

    const newPackageJson = getExpectedPackageJson(packageJson);

    await json(context.package.path, 'package.json').set(newPackageJson);
  },
} satisfies Check;
