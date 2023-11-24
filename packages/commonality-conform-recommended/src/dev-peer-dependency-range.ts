import { Workspace } from '@commonalityco/types';
import { defineConformer } from 'commonality';
import semver from 'semver';

const stripWorkspaceProtocol = (value: string) =>
  value.replace('workspace:', '');

const getVersionWithPrefix = (version?: string): string => `^${version}`;

const getExpectedDevDependencies = (
  workspace: Workspace,
): Record<string, string> => {
  const peerDependencies = workspace.packageJson.peerDependencies;

  if (!peerDependencies) {
    return {};
  }

  const devDependencies: Record<string, string> = {};

  for (const [packageName, value] of Object.entries(peerDependencies)) {
    const devDependency = workspace.packageJson.devDependencies?.[packageName];
    const minVersion = semver.minVersion(value)?.version;
    const minVersionWithPrefix = getVersionWithPrefix(minVersion);

    if (!devDependency) {
      devDependencies[packageName] = minVersionWithPrefix;
    }

    const cleanedValue = stripWorkspaceProtocol(value);
    const cleanedDevDependency = stripWorkspaceProtocol(
      devDependency as string,
    );

    const isSubset = semver.subset(cleanedDevDependency, cleanedValue);

    if (cleanedDevDependency === '*' || isSubset) {
      continue;
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
    validate: async ({ workspace }) => {
      const peerDependencies = workspace.packageJson.peerDependencies;

      if (!peerDependencies) {
        return true;
      }

      for (const [packageName, value] of Object.entries(peerDependencies)) {
        const devDependency =
          workspace.packageJson.devDependencies?.[packageName];

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
    fix: async ({ workspace, json }) => {
      const devDependencies = getExpectedDevDependencies(workspace);

      await json('package.json').update({ devDependencies });
    },
    message: async ({ workspace, json }) => {
      const devDependencies = getExpectedDevDependencies(workspace);

      return {
        title: `Packages with peerDependencies must have matching devDependencies within a valid range`,
        context: await json('package.json').diffPartial({ devDependencies }),
        filepath: 'package.json',
      };
    },
  };
});
