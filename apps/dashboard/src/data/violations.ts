'use server';
import { cache } from 'react';
import 'server-only';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';

import { getViolationsData as getViolationDatas } from '@commonalityco/data-violations';
import { getPackagesData } from './packages';
import { getTagsData } from '@commonalityco/data-tags';

export const getViolationsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packages = await getPackagesData();
  const projectConfig = await getProjectConfig({ rootDirectory });
  const tagData = await getTagsData({ rootDirectory, packages });

  const violations = getViolationDatas({ packages, projectConfig, tagData });

  return violations;
});
