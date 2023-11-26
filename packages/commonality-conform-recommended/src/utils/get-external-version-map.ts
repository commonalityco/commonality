import { Workspace } from '@commonalityco/types';
import semver from 'semver';

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

      let normalizedVersion = version;

      if (semver.validRange(version)) {
        // Normalize the version range if it's not a single version
        // For example, you can choose to keep the range as is or transform it
        normalizedVersion = semver.minVersion(version)?.version || version;
      }

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
        semver.gtr(normalizedVersion, currentMostCommon.version);

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
