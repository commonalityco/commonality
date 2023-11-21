import { defineConformer } from 'commonality';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
] as const;

const sortObjectKeys = (obj: Record<string, string>) => {
  return obj ? Object.fromEntries(Object.entries(obj).sort()) : {};
};

export const ensureSortedDependencies = defineConformer(() => {
  return {
    name: 'commonality/ensure-sorted-dependencies',
    validate: async ({ workspace }) => {
      const packageJson = workspace.packageJson;

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
    fix: async ({ workspace, json }) => {
      const packageJson = { ...workspace.packageJson };

      for (const depType of DEPENDENCY_TYPES) {
        const deps = packageJson[depType];

        if (deps) {
          const sortedDeps = sortObjectKeys(deps);
          const originalKeys = Object.keys(deps);
          const sortedKeys = Object.keys(sortedDeps);
          const hasSortedKeys = sortedKeys.every(
            (value, index) => value === originalKeys[index],
          );

          if (!hasSortedKeys) {
            packageJson[depType] = sortedDeps;
          }
        }
      }

      await json('package.json').merge(packageJson);
    },
    message: 'Dependencies in package.json must be sorted alphabetically',
  };
});
