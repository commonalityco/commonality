import { defineCheck, diff, json, PackageJson, Workspace } from 'commonality';
import { getExternalVersionMap } from './utils/get-external-version-map';
import pick from 'lodash-es/pick';

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

export const hasConsistentExternalVersion = defineCheck(() => {
  return {
    name: 'commonality/has-consistent-external-version',
    level: 'error',
    validate: async (context) => {
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      if (!packageJson) {
        return false;
      }

      const packageJsonsWithFalsey = await Promise.all(
        context.allPackages.map((pkg) => json(pkg.path, 'package.json').get()),
      );

      const packageJsons = packageJsonsWithFalsey.filter(
        (
          pkg,
        ): pkg is {
          name?: string;
          dependencies?: Partial<Record<string, string>>;
          devDependencies?: Partial<Record<string, string>>;
          optionalDependencies?: Partial<Record<string, string>>;
          // eslint-disable-next-line unicorn/prefer-native-coercion-functions
        } => Boolean(pkg),
      );

      const externalVersionMap = getExternalVersionMap(packageJsons);

      if (!packageJson.name) {
        throw new Error('Packages must have a name property');
      }

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

          if (version !== externalVersion) {
            return false;
          }
        }
      }

      return true;
    },
    fix: async (context) => {
      const expectedPackageJson = await getExpectedPackageJson({
        workspace: context.package,
        allWorkspaces: context.allPackages,
      });

      await json(context.package.path, 'package.json').set(expectedPackageJson);
    },

    message: async (context) => {
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      const expectedPackageJson = await getExpectedPackageJson({
        workspace: context.package,
        allWorkspaces: context.allPackages,
      });

      return {
        title:
          'External dependencies must match the most common or highest version',
        suggestion: diff(
          pick(packageJson, DEPENDENCY_TYPES),
          pick(expectedPackageJson, DEPENDENCY_TYPES),
        ),
        filePath: 'package.json',
      };
    },
  };
});
