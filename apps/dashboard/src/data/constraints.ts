'use server';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';

export const getConstraintsData = async () => {
  const projectConfig = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return projectConfig.constraints ?? [];
};
