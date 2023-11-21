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
    validate: async ({ json }) => {
      if (!options) {
        return false;
      }

      return json('package.json').containsPartial(expectedDependencies);
    },
    fix: async ({ workspace, json }) => {
      if (!options) {
        return;
      }

      return json('package.json').merge(expectedDependencies);
    },
    message: async ({ json }) => {
      return {
        title: `Packages with dependencies ${JSON.stringify(
          options.dependencies,
        )} must match version ${options.version}`,
        filepath: 'package.json',
        context: await json('package.json').diff(expectedDependencies),
      };
    },
  };
});
