import { defineConformer, diff, json, PackageJson } from 'commonality';
import semver from 'semver';

const stripWorkspaceProtocol = (value: string) => {
  return value.replace('workspace:', '');
};

const getVersionWithPrefix = (version?: string): string => `^${version}`;

const getExpectedDevDependencies = (
  packageJson: PackageJson,
): Record<string, string> => {
  const peerDependencies = packageJson.peerDependencies;

  if (!peerDependencies) {
    return {};
  }

  const devDependencies: Record<string, string> = {};

  for (const [packageName, value] of Object.entries(peerDependencies)) {
    if (!value) {
      continue;
    }

    const devDependency = packageJson.devDependencies?.[packageName];
    const minVersion = semver.minVersion(value)?.version;
    const minVersionWithPrefix = getVersionWithPrefix(minVersion);
    const cleanedValue = stripWorkspaceProtocol(value);

    if (devDependency) {
      const cleanedDevDependency = stripWorkspaceProtocol(devDependency);

      const isSubset = semver.subset(cleanedDevDependency, cleanedValue);

      if (cleanedDevDependency === '*' || isSubset) {
        continue;
      } else {
        devDependencies[packageName] = minVersionWithPrefix;
      }
    } else {
      devDependencies[packageName] = minVersionWithPrefix;
    }
  }

  return devDependencies;
};

export const devPeerDependencyRange = defineConformer(() => {
  return {
    name: 'commonality/dev-peer-dependency-range',
    level: 'warning',
    validate: async () => {
      const packageJson = await json<PackageJson>('package.json').get();

      if (!packageJson) {
        return false;
      }

      const peerDependencies = packageJson.peerDependencies;

      if (!peerDependencies) {
        return true;
      }

      for (const [packageName, value] of Object.entries<string>(
        peerDependencies,
      )) {
        const devDependency = packageJson.devDependencies?.[packageName];

        if (!devDependency) {
          return false;
        }

        const cleanedValue = stripWorkspaceProtocol(value);
        const cleanedDevDependency = stripWorkspaceProtocol(devDependency);

        const isSubset = semver.subset(cleanedDevDependency, cleanedValue);

        if (cleanedDevDependency === '*' || isSubset) {
          continue;
        } else {
          return false;
        }
      }

      return true;
    },
    fix: async () => {
      const packageJson = await json<PackageJson>('package.json').get();

      if (!packageJson) {
        return;
      }

      const devDependencies = getExpectedDevDependencies(packageJson);

      await json('package.json').merge({ devDependencies });
    },
    message: async () => {
      const packageJson = await json('package.json').get();

      if (!packageJson) {
        return { title: 'Package.json is missing' };
      }

      const devDependencies = getExpectedDevDependencies(packageJson);

      return {
        title: `Packages with peerDependencies must have matching devDependencies within a valid range`,
        context: diff(packageJson, {
          devDependencies: devDependencies,
          peerDependencies: packageJson.peerDependencies,
        }),
        filepath: 'package.json',
      };
    },
  };
});
