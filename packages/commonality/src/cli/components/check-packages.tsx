import React from 'react';
import { getRootDirectory } from '@commonalityco/data-project';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import { useAsyncFn } from '../utils/use-async-fn.js';
import { Package } from '@commonalityco/types';
import { getPackages } from '@commonalityco/data-packages';

export const CheckPackages = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  children: (options: { packages: Package[] }) => React.ReactNode;
  loadingMessage?: React.ReactNode;
}) => {
  const {
    data: packages,
    error,
    isLoading,
    isError,
  } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({ rootDirectory });
    return packages;
  });

  if (isError) {
    return <ErrorMessage error={error} title="Could not read packages" />;
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!packages || packages.length === 0) {
    return <Text>No packages found in project</Text>;
  }

  return children({ packages });
};
