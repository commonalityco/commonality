'use server';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';
import { Constraint } from '@commonalityco/types';

export const getConstraintsData = async (): Promise<Constraint[]> => {
  const projectConfig = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return projectConfig.constraints ?? [];
};
