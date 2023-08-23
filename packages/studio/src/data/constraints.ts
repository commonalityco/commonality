'use server';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';
import { Constraint } from '@commonalityco/types';
import { unstable_cache } from 'next/cache';
import { constraintsKeys } from '@commonalityco/utils-graph/query-keys';

export const getConstraintsData = async (): Promise<Constraint[]> => {
  return unstable_cache(
    async () => {
      const projectConfig = await getProjectConfig({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });

      return projectConfig.constraints ?? [];
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-constraints`],
    {
      tags: constraintsKeys,
    },
  )();
};
