'use server';
import { getPackages } from '@commonalityco/data-packages';

export const preload = () => {
  void getPackagesData();
};

export const getPackagesData = async () => {
  const packagesData = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return packagesData.sort((a, b) => a.name.localeCompare(b.name));
};
