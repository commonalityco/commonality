import { PackageJson } from '@commonalityco/types';
import { defineConformer } from 'commonality';

const propertyNameByType = {
  peer: 'peerDependencies',
  development: 'devDependencies',
  production: 'dependencies',
} as const;

type DependencyType = keyof typeof propertyNameByType;

export const ensureVersion = defineConformer(
  (options: {
    version: string;
    dependencies: string[];
    type?: Array<DependencyType>;
  }) => {
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
          expectedDependencies[propertyNameByType[dependencyType]] =
            dependencies;
        }
      }
    }

    return {
      name: 'COMMONALITY/ENSURE_VERSION',
      validate: async ({ json }) => {
        if (!options) {
          throw new Error('Options required');
        }

        const packageJson = await json('package.json').get();

        for (const type of options.type ?? []) {
          const propertyName = propertyNameByType[type];
          const deps = packageJson[propertyName];

          if (!deps) {
            continue;
          }

          for (const [name, version] of Object.entries(deps)) {
            if (!options.dependencies.includes(name)) {
              continue;
            }

            if (version !== options.version) {
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

        return json('package.json').update(expectedDependencies);
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
  },
);
