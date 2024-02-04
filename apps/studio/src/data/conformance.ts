'use server';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';
import { getPackagesData } from './packages';
import { getTagsData } from '@commonalityco/data-tags';
import {
  getConformanceResults,
  getResolvedChecks,
} from '@commonalityco/utils-conformance';
import { getCodeownersData } from '@commonalityco/data-codeowners';

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

  const checks = getResolvedChecks({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    projectConfig: projectConfig?.config,
  });

  const results = await getConformanceResults({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    conformersByPattern: checks.resolved ?? {},
    packages,
    tagsData,
    codeownersData,
  });

  return results.sort((a, b) => a.name.localeCompare(b.name));
};
