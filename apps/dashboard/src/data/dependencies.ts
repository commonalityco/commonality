'use server';
import 'server-only';
import { getDependencies } from '@commonalityco/data-packages';

export const getDependenciesData = async () => {
  return getDependencies({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
};
