import React from 'react';
import { getDependencies } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import { Dependency } from '@commonalityco/types';
import { useAsyncFn } from '../utils/use-async-fn.js';

export const CheckDependencies = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  children: (options: { dependencies: Dependency[] }) => React.ReactNode;
  loadingMessage?: React.ReactNode;
}) => {
  const {
    data: dependencies,
    error,
    isLoading,
    isError,
  } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();

    return await getDependencies({ rootDirectory });
  });

  if (isError) {
    return <ErrorMessage error={error} title="Could not read dependencies" />;
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!dependencies?.length || dependencies.length === 0) {
    return <Text>There are no internal dependencies in this project</Text>;
  }

  return children({ dependencies });
};
