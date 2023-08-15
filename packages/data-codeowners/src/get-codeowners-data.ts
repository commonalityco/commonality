import { CodeownersData, Package } from '@commonalityco/types';
import { getCodeowners } from './core/get-codeowners.js';
import { getOwnersForPath } from './core/get-owners-for-path.js';

export const getCodeownersData = async ({
  rootDirectory,
  packages,
}: {
  rootDirectory: string;
  packages: Package[];
}): Promise<CodeownersData[]> => {
  const codeownersData: CodeownersData[] = [];
  const codeowners = await getCodeowners({ rootDirectory });

  for (const pkg of packages) {
    const ownersForPath = getOwnersForPath({ path: pkg.path, codeowners });

    codeownersData.push({ packageName: pkg.name, codeowners: ownersForPath });
  }

  return codeownersData;
};
