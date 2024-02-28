'use server';
import { getDependencies } from '@commonalityco/data-packages';

export const preload = () => {
  getDependenciesData();
};

export const getDependenciesData = async () => {
  return getDependencies({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
};
