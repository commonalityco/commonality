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

  for (const package_ of packages) {
    const ownersForPath = getOwnersForPath({ path: package_.path, codeowners });

    codeownersData.push({
      packageName: package_.name,
      codeowners: ownersForPath,
    });
  }

  console.log({ codeownersData });

  return codeownersData;
};
