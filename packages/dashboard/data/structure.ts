import 'server-only';
import { cache } from 'react';
import { getRootDirectory, getProjectConfig } from '@commonalityco/snapshot';

export const getRootDirectoryData = cache(async () => {
  return getRootDirectory();
});

export const getProjectConfigData = cache(async () => {
  const rootDirectory = await getRootDirectoryData();

  return getProjectConfig(rootDirectory);
});
