import fs from 'fs-extra';
import path from 'path';
import { Lockfile } from '../constants/Lockfile';
import { PackageManager } from '../constants/PackageManager';

export const getPackageManager = async (
  rootDirectory: string
): Promise<PackageManager> => {
  const getFileExistsAtRoot = async (fileName: string) => {
    return fs.pathExists(path.join(rootDirectory, fileName));
  };

  if (await getFileExistsAtRoot(Lockfile.NPM_LOCKFILE)) {
    return PackageManager.NPM;
  } else if (await getFileExistsAtRoot(Lockfile.YARN_LOCKFILE)) {
    return PackageManager.YARN;
  } else if (await getFileExistsAtRoot(Lockfile.PNPM_LOCKFILE)) {
    return PackageManager.PNPM;
  }

  throw Error('Could not detect package manager');
};
