'use server';
import 'server-only';
import { getProjectConfig } from '@commonalityco/data-project';

export const getProjectConfigData = async () => {
  const foo = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return foo;
};
