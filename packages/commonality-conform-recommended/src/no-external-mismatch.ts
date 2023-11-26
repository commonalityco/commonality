import { defineConformer } from 'commonality';
import { Workspace } from '@commonalityco/types';
import semver from 'semver';
import { diff } from '@commonalityco/utils-file';

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

export function getExternalVersionMap(
  workspaces: Workspace[],
): Map<string, string> {
  // Set to store names of internal packages
  const internalPackages = new Set<string>();
  // Map to store frequency of each version of a package
  const versionFrequency = new Map<string, Map<string, number>>();
  // Map to store the most common version of each package
  const mostCommonVersionMap = new Map<
    string,
    { version: string; count: number }
  >();

  for (const workspace of workspaces) {
    const { name, dependencies, devDependencies, optionalDependencies } =
      workspace.packageJson;
    if (name) internalPackages.add(name);

    // Combine all types of dependencies into one object
    const allDependencies = {
      ...dependencies,
      ...devDependencies,
      ...optionalDependencies,
    };

    for (const [packageName, version] of Object.entries(allDependencies)) {
      // Skip if version is not defined or package is an internal package
      if (!version || internalPackages.has(packageName)) continue;

      // Get or initialize the version frequency map for the package
      let packageVersionFrequency = versionFrequency.get(packageName);

      if (!packageVersionFrequency) {
        packageVersionFrequency = new Map<string, number>();
        versionFrequency.set(packageName, packageVersionFrequency);
      }

      // Update the version frequency map for the package
      const currentCount = (packageVersionFrequency.get(version) || 0) + 1;
      packageVersionFrequency.set(version, currentCount);

      // Update the most common version map for the package if necessary
      const currentMostCommon = mostCommonVersionMap.get(packageName);
      const isCurrentMostCommonUndefined = !currentMostCommon;
      const isCurrentCountGreater =
        currentMostCommon && currentCount > currentMostCommon.count;
      const isCurrentCountEqualAndVersionGreater =
        currentMostCommon &&
        currentCount === currentMostCommon.count &&
        semver.gt(version, currentMostCommon.version);

      if (
        isCurrentMostCommonUndefined ||
        isCurrentCountGreater ||
        isCurrentCountEqualAndVersionGreater
      ) {
        mostCommonVersionMap.set(packageName, { version, count: currentCount });
      }
    }
  }

  // Convert the most common version map to a simple version map
  const versionMap = new Map<string, string>();
  for (const [packageName, { version }] of mostCommonVersionMap) {
    if (!internalPackages.has(packageName)) {
      versionMap.set(packageName, version);
    }
  }

  return versionMap;
}

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
