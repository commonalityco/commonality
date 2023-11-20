import { PackageJson } from '@commonalityco/types';
import { defineConformer } from 'commonality';

const propertyNameByType = {
  peer: 'peerDependencies',
  development: 'devDependencies',
  production: 'dependencies',
} as const;

type DependencyType = keyof typeof propertyNameByType;

export const ensureVersion = defineConformer<{
  version: string;
  dependencies: string[];
  type?: Array<DependencyType>;
}>((options) => {
  if (!options?.version || typeof options.version !== 'string') {
    throw new TypeError('Invalid version for ensureVersion');
  }

  if (!options?.dependencies || !Array.isArray(options.dependencies)) {
    throw new TypeError('Invalid dependencies for ensureVersion');
  }

  if (options.type && !Array.isArray(options.type)) {
    throw new TypeError('Invalid type for ensureVersion');
  }

  const expectedDependencies: Partial<PackageJson> = {};

  if (options.type) {
    for (const dependencyType of options.type) {
      if (['peer', 'development', 'production'].includes(dependencyType)) {
        const dependencies: Record<string, string> = {};

        for (const dependency of options.dependencies) {
          dependencies[dependency] = options.version;
        }
        expectedDependencies[propertyNameByType[dependencyType]] = dependencies;
      }
    }
  }

  return {
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
    message: async ({ json }) => {
      return {
        title: `Packages with dependencies ${JSON.stringify(
          options.dependencies,
        )} must match version ${options.version}`,
        filepath: 'package.json',
        context: await json('package.json').diffPartial(expectedDependencies),
      };
    },
  };
});
