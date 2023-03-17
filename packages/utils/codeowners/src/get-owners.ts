import { getRootDirectory } from '@commonalityco/structure';
import { getCodeowners } from './get-codeowners';

export const getOwners = async () => {
  const rootDirectory = await getRootDirectory();

  const ownersMap = {};

  const codeowners = getCodeowners({ rootDirectory });

  for (const owners of Object.values(codeowners)) {
    for (const owner of owners) {
      ownersMap[owner] = true;
    }
  }

  return Object.keys(ownersMap);
};
