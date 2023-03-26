import { getPackageDirectoriesData } from './packages';
import { cache } from 'react';
import 'server-only';
import { getRootDirectory, getTags } from '@commonalityco/snapshot';

export const getTagsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packageDirectories = await getPackageDirectoriesData();

  return getTags({ packageDirectories, rootDirectory });
});
