import { PackageConfig } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';

export const getPackageConfig = ({
  cwd = process.cwd(),
  directory,
}: {
  cwd?: string;
  directory: string;
}): PackageConfig => {
  const packageConfigPath = path.join(cwd, directory, 'commonality.json');

  return fs.readJSONSync(packageConfigPath);
};
