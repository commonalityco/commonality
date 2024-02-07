import { Check, diff, json, PackageJson, Workspace } from 'commonality';
import { getExternalVersionMap } from './utils/get-external-version-map';
import pick from 'lodash-es/pick';
import isMatch from 'lodash-es/isMatch';

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

const getExpectedPackageJson = async ({
  workspace,
  allWorkspaces,
}: {
  workspace: Workspace;
  allWorkspaces: Workspace[];
}): Promise<PackageJson> => {
  const allPackageJsons = await Promise.all(
    allWorkspaces.map((workspace) =>
      json<PackageJson>(workspace.path, 'package.json').get(),
    ),
  );
  const packageJson = await json<PackageJson>(
    workspace.path,
    'package.json',
  ).get();

  if (!packageJson) {
    return {};
  }

  const validPackageJsons = allPackageJsons.filter(Boolean) as PackageJson[];

  const externalVersionMap = getExternalVersionMap(validPackageJsons);

  for (const dependencyType of DEPENDENCY_TYPES) {
    const dependencies = packageJson[dependencyType];

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

  return packageJson;
};

export default {
  level: 'error',
  message: 'External dependencies must match the most common or highest version',
  validate: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return false;
    }

    const expectedPackageJson = await getExpectedPackageJson({
      workspace: context.package,
      allWorkspaces: context.allPackages,
    });

    return isMatch(packageJson, expectedPackageJson)
      ? true
      : {
          suggestion: diff(
            pick(packageJson, DEPENDENCY_TYPES),
            pick(expectedPackageJson, DEPENDENCY_TYPES),
          ),
          path: 'package.json',
        };
  },
  fix: async (context) => {
    const expectedPackageJson = await getExpectedPackageJson({
      workspace: context.package,
      allWorkspaces: context.allPackages,
    });

    await json(context.package.path, 'package.json').set(expectedPackageJson);
  },
} satisfies Check;
