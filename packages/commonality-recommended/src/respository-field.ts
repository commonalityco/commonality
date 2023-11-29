import {
  defineConformer,
  diff,
  json,
  PackageJson,
  Workspace,
} from 'commonality';
import path from 'node:path';

const stripTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

const getExpectedProperties = async ({
  rootWorkspace,
  workspace,
}: {
  rootWorkspace: Workspace;
  workspace: Workspace;
}): Promise<
  { repository: { url: string } } | { repository: string } | undefined
> => {
  const rootPackageJson = await json<PackageJson>(
    path.join(rootWorkspace.path, 'package.json'),
  ).get();

  const packageJson = await json<PackageJson>(
    path.join(workspace.path, 'package.json'),
  ).get();

  if (!packageJson) {
    return undefined;
  }

  const getRootRepository = () => {
    if (!rootPackageJson) {
      return;
    }

    if (typeof rootPackageJson.repository === 'string') {
      return rootPackageJson.repository;
    }

    if (typeof rootPackageJson.repository === 'object') {
      return rootPackageJson.repository.url;
    }

    return;
  };

  const rootRepsitoryRaw = getRootRepository();

  if (!rootRepsitoryRaw) {
    return;
  }

  const rootRepsitoryUrl = stripTrailingSlash(rootRepsitoryRaw);

  const workspacePath = path
    .normalize(workspace.relativePath)
    .replace(/^[/\\]+/, '');

  const isObjectConfig = typeof packageJson.repository === 'object';

  const newConfig = isObjectConfig
    ? {
        repository: { url: rootRepsitoryUrl + '/' + workspacePath },
      }
    : {
        repository: rootRepsitoryUrl + '/' + workspacePath,
      };

  return newConfig;
};

export const repositoryField = defineConformer(() => {
  return {
    name: 'commonality/repository-field',
    validate: async ({ rootWorkspace, workspace }): Promise<boolean> => {
      const rootPackageJson = await json<PackageJson>(
        path.join(rootWorkspace.path, 'package.json'),
      ).get();
      const packageJson = await json<PackageJson>(
        path.join(workspace.path, 'package.json'),
      ).get();

      if (!rootPackageJson || !rootPackageJson.repository || !packageJson) {
        return true;
      }

      const workspacePath = path
        .normalize(workspace.relativePath)
        .replace(/^[/\\]+/, '');

      const expectedUrl = rootPackageJson.repository + '/' + workspacePath;

      if (typeof rootPackageJson.repository === 'string') {
        return typeof packageJson.repository === 'string'
          ? packageJson.repository === expectedUrl
          : packageJson.repository?.url === expectedUrl;
      }

      if (typeof rootPackageJson.repository === 'object') {
        return typeof packageJson.repository === 'string'
          ? packageJson.repository === expectedUrl
          : packageJson.repository?.url === expectedUrl;
      }

      return true;
    },
    fix: async ({ rootWorkspace, workspace }) => {
      const newConfig = await getExpectedProperties({
        rootWorkspace,
        workspace,
      });

      if (!newConfig) {
        return;
      }

      return json(path.join(workspace.path, 'package.json')).merge(newConfig);
    },

    message: async ({ workspace, rootWorkspace }) => {
      const newConfig = await getExpectedProperties({
        rootWorkspace,
        workspace,
      });

      const packageJson = await json<PackageJson>(
        path.join(workspace.path, 'package.json'),
      ).get();

      if (!packageJson) {
        return {
          title: 'Package.json is missing.',
          filepath: 'package.json',
          context: 'Create a package.json file in your workspace.',
        };
      }

      if (!newConfig) {
        return {
          title: 'Repository field is missing.',
          filepath: 'package.json',
          context: 'Add a repository field to your root package.json',
        };
      }

      return {
        title:
          'Repository field extend the repository field at the root of your project.',
        filepath: 'package.json',
        context: diff(packageJson, { ...packageJson, ...newConfig }),
      };
    },
  };
});
