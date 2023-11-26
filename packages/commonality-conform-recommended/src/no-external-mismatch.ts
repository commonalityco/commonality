import { defineConformer } from 'commonality';
import { diff } from '@commonalityco/utils-file';
import { getExternalVersionMap } from './utils/get-external-version-map';

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

export const noExternalMismatch = defineConformer(() => {
  return {
    name: 'commonality/external-mismatch',
    validate: async ({ projectWorkspaces, workspace }) => {
      const externalVersionMap = getExternalVersionMap(projectWorkspaces);

      if (!workspace.packageJson.name) {
        throw new Error('Packages must have a name property');
      }

      for (const dependencyType of DEPENDENCY_TYPES) {
        const dependencies = workspace.packageJson[dependencyType];

        if (!dependencies) {
          continue;
        }

        for (const [packageName, version] of Object.entries(dependencies)) {
          if (!externalVersionMap.has(packageName)) {
            continue;
          }

          const externalVersion = externalVersionMap.get(packageName);

          if (version !== externalVersion) {
            return false;
          }
        }
      }

      return true;
    },
    fix: async ({ json, projectWorkspaces, workspace }) => {
      const externalVersionMap = getExternalVersionMap(projectWorkspaces);

      if (!workspace.packageJson.name) {
        throw new Error('Packages must have a name property');
      }

      for (const dependencyType of DEPENDENCY_TYPES) {
        const dependencies = workspace.packageJson[dependencyType];

        if (!dependencies) {
          continue;
        }

        for (const [packageName, version] of Object.entries(dependencies)) {
          if (!externalVersionMap.has(packageName)) {
            continue;
          }

          const externalVersion = externalVersionMap.get(packageName);

          if (version !== externalVersion && externalVersion !== undefined) {
            dependencies[packageName] = externalVersion;
          }
        }
      }

      return json('package.json').update(workspace.packageJson);
    },
    message: async ({ json, workspace, projectWorkspaces }) => {
      // Construct an object that contains the most common version of each external dependency for the workspace's package.json
      const externalVersionMap = getExternalVersionMap(projectWorkspaces);

      const commonVersionMap: {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        optionalDependencies?: Record<string, string>;
      } = {};

      for (const dependencyType of DEPENDENCY_TYPES) {
        const dependencies = workspace.packageJson[dependencyType];

        if (!dependencies) {
          continue;
        }

        for (const [packageName, version] of Object.entries(dependencies)) {
          if (!externalVersionMap.has(packageName)) {
            continue;
          }

          const externalVersion = externalVersionMap.get(packageName);

          if (externalVersion) {
            if (!commonVersionMap[dependencyType]) {
              commonVersionMap[dependencyType] = {};
            }
            commonVersionMap[dependencyType]![packageName] = externalVersion;
          }
        }
      }

      return {
        title:
          'External dependencies must match the most common or highest version',
        context: diff(await json('package.json').get(), commonVersionMap),
        filepath: 'package.json',
      };
    },
  };
});
