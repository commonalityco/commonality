import React from 'react';
import { getPackages } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import { CodeownersData } from '@commonalityco/types';
import { useAsyncFn } from '../utils/use-async-fn.js';
import { getCodeownersData } from '@commonalityco/data-codeowners';

export const CheckCodeownersData = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  children: (options: { codeownersData: CodeownersData[] }) => React.ReactNode;
  loadingMessage?: React.ReactNode;
}) => {
  const { data, error, isLoading, isError } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({
      rootDirectory,
    });

    return await getCodeownersData({
      rootDirectory,
      packages: packages,
    });
  });

  if (isError) {
    return <ErrorMessage error={error} title="Could not read codeowners" />;
  }

  if (isLoading) {
    return loadingMessage;
  }

  return children({ codeownersData: data ?? [] });
};
