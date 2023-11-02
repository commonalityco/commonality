import { defineConformer } from 'commonality';

const propertyNameByType = {
  peer: 'peerDependencies',
  development: 'devDependencies',
  production: 'dependencies',
} as const;

export const ensureVersion = defineConformer<{
  version: string;
  dependencies: string[];
  type?: Array<'peer' | 'development' | 'production'>;
}>((options) => ({
  name: 'COMMONALITY/ENSURE_VERSION',
  validate: async ({ workspace }) => {
    if (!options) {
      return false;
    }

    const dependencyTypes = options.type || [
      'production',
      'development',
      'peer',
    ];

    for (const dependencyType of dependencyTypes) {
      const propertyName = propertyNameByType[dependencyType];
      const dependencyMap = workspace.packageJson[propertyName] ?? {};
      const dependencyNames = Object.keys(dependencyMap);

      for (const dependencyName of dependencyNames) {
        const dependencyVersion = dependencyMap[dependencyName];

        if (
          !dependencyVersion ||
          !options.dependencies.includes(dependencyName)
        ) {
          continue;
        }

        if (dependencyVersion !== options.version) {
          return false;
        }
      }
    }

    return true;
  },
  fix: async ({ workspace, json }) => {
    if (!options) {
      return;
    }

    const packageJson = json('package.json');
    const dependencyTypes = options.type || [
      'production',
      'development',
      'peer',
    ];

    for (const dependencyType of dependencyTypes) {
      const propertyName = propertyNameByType[dependencyType];
      const dependencyMap = workspace.packageJson[propertyName] ?? {};
      const dependencyNames = Object.keys(dependencyMap);

      await Promise.all(
        dependencyNames.map((dependencyName) => {
          const dependencyVersion = dependencyMap[dependencyName];
          const isApplicableDependency =
            options.dependencies.includes(dependencyName);

          if (
            !dependencyVersion ||
            !isApplicableDependency ||
            dependencyVersion === options.version
          ) {
            return;
          }

          if (dependencyVersion !== options.version) {
            return packageJson.set(
              `${propertyName}.${dependencyName}`,
              options.version,
            );
          }
        }),
      );
    }
  },
  message: options
    ? `Packages with dependencies ${JSON.stringify(
        options.dependencies,
      )} must match version ${options.version}`
    : 'Invalid version',
}));
