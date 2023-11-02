import { getRootDirectory } from '@commonalityco/data-project';
import { Workspace } from '@commonalityco/types';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import React from 'react';
import { useAsyncFn } from '../utils/use-async-fn.js';
import { getWorkspaces } from '@commonalityco/data-workspaces';

export const CheckWorkspaces = ({
  loadingMessage,
  children,
}: {
  loadingMessage: React.ReactNode;
  children: (options: { workspaces: Workspace[] }) => React.ReactNode;
}) => {
  const { data, error, isLoading, isError } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    return await getWorkspaces({
      rootDirectory,
    });
  });

  if (isError) {
    return <ErrorMessage error={error} title="Could not read workspaces" />;
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!data?.length || data.length === 0) {
    return <Text>No packages found</Text>;
  }

  return children({ workspaces: data });
};
