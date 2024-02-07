import { Check, diff, json, PackageJson } from 'commonality';
import isMatch from 'lodash-es/isMatch';
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

    const cleanedValue = stripWorkspaceProtocol(value);

    const minVersion = semver.minVersion(cleanedValue)?.version;
    const minVersionWithPrefix = getVersionWithPrefix(minVersion);

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

export default {
  level: 'warning',
  message: `Packages with peerDependencies must have matching devDependencies within a valid range`,
  validate: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return { message: 'package.json is missing' };
    }

    const expectedDevDependencies = getExpectedDevDependencies(packageJson);

    if (!expectedDevDependencies) {
      return true;
    }

    if (
      !isMatch(packageJson, {
        devDependencies: expectedDevDependencies,
      })
    ) {
      return {
        message: title,
        suggestion: diff(
          { devDependencies: packageJson.devDependencies },
          {
            devDependencies: expectedDevDependencies,
          },
        ),
        path: 'package.json',
      };
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
} satisfies Check;
