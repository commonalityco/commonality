import { defineCheck, diff, json, PackageJson } from 'commonality';
import semver from 'semver';

const stripWorkspaceProtocol = (value: string) => {
  return value.replace('workspace:', '');
};

const getVersionWithPrefix = (version?: string): string => `^${version}`;

const title = `Packages with peerDependencies must have matching devDependencies within a valid range`;

const getExpectedDevDependencies = (
  packageJson: PackageJson,
): Record<string, string> | undefined => {
  const peerDependencies = packageJson.peerDependencies;

  if (!peerDependencies) {
    return;
  }

  const devDependencies: PackageJson['devDependencies'] = {};

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

  return Object.keys(devDependencies).length > 0 ? devDependencies : undefined;
};

export const hasMatchingDevPeerVersions = defineCheck(() => {
  return {
    name: 'commonality/has-matching-dev-peer-versions',
    level: 'warning',
    validate: async (context) => {
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

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
    fix: async (context) => {
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      if (!packageJson) {
        return;
      }

      const devDependencies = getExpectedDevDependencies(packageJson);

      await json(context.package.path, 'package.json').merge({
        devDependencies,
      });
    },
    message: async (context) => {
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      if (!packageJson) {
        return { title: 'Package.json is missing' };
      }

      const expectedDevDependencies = getExpectedDevDependencies(packageJson);

      if (!expectedDevDependencies) {
        return { title, filePath: 'package.json' };
      }

      const source: Partial<PackageJson> = {
        peerDependencies: packageJson.peerDependencies,
      };
      const target: Partial<PackageJson> = {
        peerDependencies: packageJson.peerDependencies,
      };

      if (expectedDevDependencies) {
        target.devDependencies = expectedDevDependencies;
      }

      if (packageJson.devDependencies) {
        source.devDependencies = packageJson.devDependencies;
      }

      return {
        title,
        suggestion: diff(source, target),
        filePath: 'package.json',
      };
    },
  };
});
