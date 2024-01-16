import { defineCheck, diff, json, PackageJson, Workspace } from 'commonality';
import path from 'node:path';
import pick from 'lodash-es/pick';
import isMatch from 'lodash-es/isMatch';

const getExpectedProperties = async ({
  rootWorkspace,
  workspace,
}: {
  rootWorkspace: Workspace;
  workspace: Workspace;
}): Promise<
  { repository: { url: string; directory: string; type: string } } | undefined
> => {
  const rootPackageJson = await json<PackageJson>(
    rootWorkspace.path,
    'package.json',
  ).get();

  const packageJson = await json<PackageJson>(
    workspace.path,
    'package.json',
  ).get();

  if (!packageJson) {
    return undefined;
  }

  const getRootRepository = () => {
    if (!rootPackageJson) {
      return;
    }

    if (typeof rootPackageJson.repository === 'string') {
      return new URL(rootPackageJson.repository).toString();
    }

    if (typeof rootPackageJson.repository === 'object') {
      return new URL(rootPackageJson.repository.url).toString();
    }

    return;
  };

  const rootRepositoryUrl = getRootRepository();

  if (!rootRepositoryUrl) {
    return;
  }

  // Normalize the workspace relative path and remove any leading slashes or backslashes
  const workspacePath = path
    .normalize(workspace.relativePath)
    .replace(/^[/\\]+/, '');

  return {
    repository: {
      type: 'git',
      url: rootRepositoryUrl,
      directory: workspacePath,
    },
  };
};

export const extendsRepositoryField = defineCheck(() => {
  return {
    name: 'commonality/extends-repository-field',
    level: 'error',
    validate: async (context): Promise<boolean> => {
      const rootPackageJson = await json<PackageJson>(
        context.rootPackage.path,
        'package.json',
      ).get();
      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      if (!rootPackageJson || !rootPackageJson.repository || !packageJson) {
        return true;
      }

      const expectedProperties = await getExpectedProperties({
        rootWorkspace: context.rootPackage,
        workspace: context.package,
      });

      if (!expectedProperties) return true;

      return isMatch(packageJson, expectedProperties);
    },
    fix: async (context) => {
      const newConfig = await getExpectedProperties({
        rootWorkspace: context.rootPackage,
        workspace: context.package,
      });

      if (!newConfig) {
        return;
      }

      return json(context.package.path, 'package.json').merge(newConfig);
    },

    message: async (context) => {
      const newConfig = await getExpectedProperties({
        rootWorkspace: context.rootPackage,
        workspace: context.package,
      });

      const packageJson = await json<PackageJson>(
        context.package.path,
        'package.json',
      ).get();

      if (!packageJson) {
        return {
          title: 'Package.json is missing.',
          filePath: 'package.json',
          suggestion: 'Create a package.json file in your workspace.',
        };
      }

      if (!newConfig) {
        return {
          title: 'Repository field is missing.',
          filePath: 'package.json',
          suggestion: 'Add a repository field to your root package.json',
        };
      }

      return {
        title: `Package's repository property must extend the repository property at the root of your project.`,
        filePath: 'package.json',
        suggestion: diff(
          pick(packageJson, ['name', 'repository']),
          pick(
            {
              ...packageJson,
              ...newConfig,
            },
            ['name', 'repository'],
          ),
        ),
      };
    },
  };
});
