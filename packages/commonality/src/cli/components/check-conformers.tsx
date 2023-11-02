import { Text } from 'ink';
import { ErrorMessage } from './error-message.js';
import { Conformer } from '@commonalityco/types';
import React from 'react';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { useAsyncFn } from '../utils/use-async-fn.js';

export const CheckConformers = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  loadingMessage: React.ReactNode;
  children: (options: {
    conformers: Record<string, Conformer[]>;
  }) => React.ReactNode;
}) => {
  const { data, error, isLoading, isError } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    const projectConfig = await getProjectConfig({ rootDirectory });
    return projectConfig;
  });

  const isValid = !data?.isEmpty && data?.config;

  if (isError) {
    return (
      <ErrorMessage
        error={error}
        title="Could not read project configuration"
      />
    );
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!isValid) {
    return <Text>No project configuration found</Text>;
  }

  if (
    !data.config.conformers ||
    Object.keys(data.config.conformers).length === 0
  ) {
    return <Text>No checks found</Text>;
  }

  return children({ conformers: data.config.conformers });
};
