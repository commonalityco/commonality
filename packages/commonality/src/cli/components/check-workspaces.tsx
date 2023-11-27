import { getRootDirectory } from '@commonalityco/data-project';
import { Workspace } from '@commonalityco/types';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import React from 'react';
import { useAsyncFn } from '../utils/use-async-fn.js';
import {
  getWorkspaces,
  getRootWorkspace,
} from '@commonalityco/data-workspaces';

export const CheckWorkspaces = ({
  loadingMessage,
  children,
}: {
  loadingMessage: React.ReactNode;
  children: (options: {
    workspaces: Workspace[];
    rootWorkspace: Workspace;
  }) => React.ReactNode;
}) => {
  const workspacesResult = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    return await getWorkspaces({
      rootDirectory,
    });
  });

  const rootWorkspaceResult = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    return await getRootWorkspace({
      rootDirectory,
    });
  });

  if (rootWorkspaceResult.error) {
    return (
      <ErrorMessage
        error={rootWorkspaceResult.error}
        title="Could not read root workspace"
      />
    );
  }

  if (workspacesResult.error) {
    return (
      <ErrorMessage
        error={workspacesResult.error}
        title="Could not read workspaces"
      />
    );
  }

  if (rootWorkspaceResult.isLoading || workspacesResult.isLoading) {
    return loadingMessage;
  }

  if (!rootWorkspaceResult.data) {
    return <Text>No root workspace found</Text>;
  }

  return children({
    workspaces: workspacesResult.data ?? [],
    rootWorkspace: rootWorkspaceResult.data,
  });
};
