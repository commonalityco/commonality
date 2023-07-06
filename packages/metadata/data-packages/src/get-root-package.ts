import { Package } from '@commonalityco/types';
import { getPackage } from './get-package';

export const getRootPackage = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<Package> => {
  return await getPackage({
    rootDirectory,
    directory: './',
  });
};
