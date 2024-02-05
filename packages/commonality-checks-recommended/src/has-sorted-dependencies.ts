import { Check, json, PackageJson } from 'commonality';

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

export default {
  name: 'commonality/has-sorted-dependencies',
  level: 'warning',
  validate: async (ctx) => {
    const packageJson = await json<PackageJson>(
      ctx.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return false;
    }

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
  fix: async (ctx) => {
    const packageJson = await json<PackageJson>(
      ctx.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return;
    }

    const expectedPackageJson = getExpectedPackageJson(packageJson);

    await json(ctx.package.path, 'package.json').set(expectedPackageJson);
  },
  message: 'Dependencies in package.json must be sorted alphabetically',
} satisfies Check;
