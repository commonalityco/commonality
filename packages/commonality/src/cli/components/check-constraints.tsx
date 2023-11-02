import React from 'react';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { Text, useApp } from 'ink';
import { useAsyncFn } from '../utils/use-async-fn.js';
import { ProjectConfig } from '@commonalityco/types';

export const CheckConstraints = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  children: (options: {
    constraints: ProjectConfig['constraints'];
  }) => React.ReactNode;
  loadingMessage?: React.ReactNode;
}) => {
  const { exit } = useApp();
  const { data, error, isLoading } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    const projectConfig = await getProjectConfig({ rootDirectory });
    return projectConfig;
  });

  const isValid = !data?.isEmpty && data?.config;

  if (error) {
    exit(error);
    return;
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!isValid) {
    return <Text>No project configuration found</Text>;
  }

  if (
    !data.config.constraints ||
    Object.keys(data.config.constraints).length === 0
  ) {
    return <Text>No checks found</Text>;
  }

  return children({ constraints: data.config.constraints });
};
