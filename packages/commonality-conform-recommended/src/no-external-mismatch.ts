import { defineConformer } from 'commonality';
import { diff } from '@commonalityco/utils-file';
import { getExternalVersionMap } from './utils/get-external-version-map';
import { Workspace } from '@commonalityco/types';

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

const getExpectedPackageJson = ({
  workspace,
  allWorkspaces,
}: {
  workspace: Workspace;
  allWorkspaces: Workspace[];
}) => {
  const externalVersionMap = getExternalVersionMap(allWorkspaces);
  const newPackageJson = JSON.parse(JSON.stringify(workspace.packageJson));

  for (const dependencyType of DEPENDENCY_TYPES) {
    const dependencies = newPackageJson[dependencyType];

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

  return newPackageJson;
};

export const noExternalMismatch = defineConformer(() => {
  return {
    name: 'commonality/external-mismatch',
    validate: async ({ allWorkspaces, workspace }) => {
      const externalVersionMap = getExternalVersionMap(allWorkspaces);

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
    fix: async ({ json, allWorkspaces, workspace }) => {
      const expectedPackageJson = getExpectedPackageJson({
        workspace,
        allWorkspaces,
      });

      return json('package.json').update(expectedPackageJson);
    },

    message: async ({ workspace, allWorkspaces }) => {
      const expectedPackageJson = getExpectedPackageJson({
        workspace,
        allWorkspaces,
      });

      return {
        title:
          'External dependencies must match the most common or highest version',
        context: diff(workspace.packageJson, expectedPackageJson),
        filepath: 'package.json',
      };
    },
  };
});
