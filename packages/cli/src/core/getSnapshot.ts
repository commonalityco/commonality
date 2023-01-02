import fs from 'fs-extra';
import path from 'path';
import { getPackages } from './getPackages';
import { LocalPackage } from '@commonalityco/types';
import { getTags } from './getTags';
import { getCurrentBranch } from './getCurrentBranch';

export const getSnapshot = async (
  rootDirectory: string,
  packageDirectories: string[]
): Promise<{
  projectId: string;
  branch: string;
  packages: LocalPackage[];
  tags: string[];
}> => {
  const configFilePath = path.join(
    rootDirectory,
    '.commonality',
    'config.json'
  );

  const configFile = fs.readJSONSync(configFilePath);

  const packages = await getPackages({ packageDirectories, rootDirectory });

  const currentBranch = await getCurrentBranch();

  const tags = await getTags({ packageDirectories, rootDirectory });

  return {
    branch: currentBranch,
    projectId: configFile.project,
    packages,
    tags,
  };
};
