'use server';
import { cache } from 'react';
import 'server-only';
import { getRootDirectory } from '@commonalityco/data-project';
import { getCodeownersData as getCodeownersDatas } from '@commonalityco/data-codeowners';
import { getPackages } from '@commonalityco/data-packages';

export const getCodeownersData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packages = await getPackages({ rootDirectory });
  const codeowners = await getCodeownersDatas({ rootDirectory, packages });

  return codeowners;
});
