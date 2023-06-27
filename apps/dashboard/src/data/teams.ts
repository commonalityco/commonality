import { getPackageDirectoriesData } from './packages';
import { cache } from 'react';
import 'server-only';
import { getRootDirectory, getTags } from '@commonalityco/snapshot';
import { getOwners } from '@commonalityco/codeowners';

export const getTagsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packageDirectories = await getPackageDirectoriesData();

  return getTags({ packageDirectories, rootDirectory });
});

export const getTeamsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const teams = await getOwners({ cwd: rootDirectory });

  return teams;
});
