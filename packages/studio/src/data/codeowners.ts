'use server';
import { cache } from 'react';
import 'server-only';
import { getCodeownersData as getCodeownersDatas } from '@commonalityco/data-codeowners';
import { getPackages } from '@commonalityco/data-packages';

export const getCodeownersData = cache(async () => {
  const packages = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const codeowners = await getCodeownersDatas({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });

  return codeowners;
});
