'use server';
import { getDependencies } from '@commonalityco/data-packages';
import { cache } from 'react';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';
import { getViolations } from '@commonalityco/data-violations';
import { getPackagesData } from './packages';
import { getTagsData } from '@commonalityco/data-tags';
import { unstable_cache } from 'next/cache';
import { violationsKeys } from '@commonalityco/utils-graph/query-keys';

export const getViolationsData = cache(async () => {
  return unstable_cache(
    async () => {
      const packages = await getPackagesData();
      const projectConfig = await getProjectConfig({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });
      const tagsData = await getTagsData({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
        packages,
      });

      const dependencies = await getDependencies({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });

      const violations = getViolations({
        dependencies,
        constraints: projectConfig.constraints,
        tagsData,
      });

      return violations;
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-violations`],
    {
      tags: violationsKeys,
    },
  )();
});
