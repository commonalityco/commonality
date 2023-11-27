import { Workspace } from '@commonalityco/types';
import { diff } from '@commonalityco/utils-file';
import { defineConformer } from 'commonality';

const stripTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

const stripLeadingSlash = (str: string) => {
  return str.startsWith('/') ? str.slice(1) : str;
};

const getExpectedProperties = ({
  rootWorkspace,
  workspace,
}: {
  rootWorkspace: Workspace;
  workspace: Workspace;
}) => {
  const getRootRepository = () => {
    if (typeof rootWorkspace.packageJson.repository === 'string') {
      return rootWorkspace.packageJson.repository;
    }

    if (typeof rootWorkspace.packageJson.repository === 'object') {
      return rootWorkspace.packageJson.repository.url;
    }

    return '';
  };

  const rootRepsitory = stripTrailingSlash(getRootRepository());
  const workspacePath = stripLeadingSlash(workspace.relativePath);

  const isObjectConfig = typeof workspace.packageJson.repository === 'object';

  const newConfig = isObjectConfig
    ? {
        repository: { url: rootRepsitory + `/${workspacePath}` },
      }
    : {
        repository: rootRepsitory + `/${workspacePath}`,
      };

  return newConfig;
};

export const repositoryField = defineConformer(() => {
  return {
    name: 'commonality/repository-field',
    validate: async ({ rootWorkspace, workspace }) => {
      if (!rootWorkspace.packageJson.repository) {
        return true;
      }

      const newConfig = getExpectedProperties({ rootWorkspace, workspace });

      if (typeof workspace.packageJson.repository === 'string') {
        return workspace.packageJson.repository === newConfig.repository;
      }

      return false;
    },
    fix: async ({ json, rootWorkspace, workspace }) => {
      const newConfig = getExpectedProperties({ rootWorkspace, workspace });

      return json('package.json').merge(newConfig);
    },

    message: ({ workspace, rootWorkspace }) => {
      const newConfig = getExpectedProperties({ rootWorkspace, workspace });

      return {
        title:
          'Repository field extend the repository field at the root of your project.',
        filepath: 'package.json',
        context: diff(workspace.packageJson, newConfig),
      };
    },
  };
});
