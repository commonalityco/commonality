import 'server-only';
import { getPackageManager } from '@commonalityco/data-project';
import { getRootPackage } from '@commonalityco/data-packages';

export const preload = () => {
  void getProject();
};

export const getProject = async () => {
  const packageManager = await getPackageManager({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const rootPackage = await getRootPackage({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return {
    name: rootPackage.name,
    packageManager,
  };
};
