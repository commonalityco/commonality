'use server';
import { getDependencies } from '@commonalityco/data-packages';
import { cache } from 'react';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';
import { getViolations } from '@commonalityco/data-violations';
import { getPackagesData } from './packages';
import { getTagsData } from '@commonalityco/data-tags';
import { getConformanceResults } from '@commonalityco/feature-conformance';
import { getCodeownersData } from '@commonalityco/data-codeowners';

export const getViolationsData = cache(async () => {
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
    constraints: projectConfig?.config.constraints,
    tagsData,
  });

  return violations;
});

export const getConformanceResultsData = async () => {
  const packages = await getPackagesData();
  const projectConfig = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const tagsData = await getTagsData({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });
  const codeownersData = await getCodeownersData({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });

  const results = await getConformanceResults({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    conformersByPattern: projectConfig?.config.conformers ?? {},
    packages,
    tagsData,
    codeownersData,
  });

  return results.sort((a, b) => a.name.localeCompare(b.name));
};
