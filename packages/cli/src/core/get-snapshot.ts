import type { SnapshotData } from '@commonalityco/types';
import { getPackages } from './get-packages';
import { getTags } from './get-tags';
import { getCurrentBranch } from './get-current-branch';

export const getSnapshot = async (
  rootDirectory: string,
  packageDirectories: string[],
  projectId: string
): Promise<SnapshotData> => {
  const packages = await getPackages({ packageDirectories, rootDirectory });

  const currentBranch = await getCurrentBranch();

  const tags = await getTags({ packageDirectories, rootDirectory });

  return {
    branch: currentBranch,
    projectId,
    packages,
    tags,
  };
};
