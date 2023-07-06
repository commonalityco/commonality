import 'server-only';
import { cache } from 'react';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';

export const getRootDirectoryData = cache(async () => {
  return getRootDirectory();
});

export const getProjectConfigData = async () => {
  const rootDirectory = await getRootDirectoryData();

  const foo = await getProjectConfig({ rootDirectory });

  return foo;
};
