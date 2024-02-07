import { Check, diff, json, PackageJson, Workspace } from 'commonality';
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

export default {
  level: 'error',
  message: `Package's repository property must extend the repository property at the root of your project.`,
  validate: async (context) => {
    const rootPackageJson = await json<PackageJson>(
      context.rootPackage.path,
      'package.json',
    ).get();
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!rootPackageJson) {
      return {
        message: 'Root package.json is missing.',
        path: 'package.json',
        suggestion: 'Create a package.json file at the root of your workspace.',
      };
    }

    if (!packageJson) {
      return {
        message: 'package.json is missing.',
        path: 'package.json',
        suggestion: 'Create a package.json file in your workspace.',
      };
    }

    const expectedProperties = await getExpectedProperties({
      rootWorkspace: context.rootPackage,
      workspace: context.package,
    });

    if (!expectedProperties) {
      return true;
    }

    if (!expectedProperties) return true;

    const extendsRespository = isMatch(packageJson, expectedProperties);

    if (!extendsRespository) {
      return {
        message: `Package's repository property must extend the repository property at the root of your project.`,
        path: 'package.json',
        suggestion: diff(
          pick(packageJson, ['name', 'repository']),
          pick(
            {
              ...packageJson,
              ...expectedProperties,
            },
            ['name', 'repository'],
          ),
        ),
      };
    }

    return true;
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
} satisfies Check;
