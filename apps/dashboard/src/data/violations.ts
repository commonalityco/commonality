'use server';
import { cache } from 'react';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';

import { getViolationsData as getViolationDatas } from '@commonalityco/data-violations';
import { getPackagesData } from './packages';
import { getTagsData } from '@commonalityco/data-tags';

export const getViolationsData = cache(async () => {
  const packages = await getPackagesData();
  const projectConfig = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const tagData = await getTagsData({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });

  const violations = getViolationDatas({ packages, projectConfig, tagData });

  return violations;
});
