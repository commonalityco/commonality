import { cache } from 'react';
import 'server-only';
import { getRootDirectory } from '@commonalityco/snapshot';

export const getRootDirectoryData = cache(async () => {
  return getRootDirectory();
});
