import 'server-only';
import { getPackageManager } from '@commonalityco/data-project';
import { getRootPackageName } from '@commonalityco/data-packages';

export const preload = () => {
  void getProject();
};

export const getProject = async () => {
  const packageManager = await getPackageManager({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const rootPackageName = await getRootPackageName({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return {
    name: rootPackageName,
    packageManager,
  };
};
