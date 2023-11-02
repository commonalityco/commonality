import React from 'react';
import { getPackages } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import { getTagsData } from '@commonalityco/data-tags';
import { ErrorMessage } from './error-message.js';
import { Text } from 'ink';
import { TagsData } from '@commonalityco/types';
import { useAsyncFn } from '../utils/use-async-fn.js';

export const CheckTagsData = ({
  children,
  loadingMessage = <Text>Loading...</Text>,
}: {
  children: (options: { tagsData: TagsData[] }) => React.ReactNode;
  loadingMessage?: React.ReactNode;
}) => {
  const { data, error, isLoading, isError } = useAsyncFn(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({
      rootDirectory,
    });

    return await getTagsData({
      rootDirectory,
      packages: packages,
    });
  });

  if (isError) {
    return <ErrorMessage error={error} title="Could not read tags" />;
  }

  if (isLoading) {
    return loadingMessage;
  }

  if (!data?.length || data.length === 0) {
    return <Text>No tags found</Text>;
  }

  return children({ tagsData: data });
};
