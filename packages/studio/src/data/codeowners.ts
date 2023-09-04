'use server';
import 'server-only';
import { cache } from 'react';
import { getCodeownersData as getCodeownersDatas } from '@commonalityco/data-codeowners';
import { getPackages } from '@commonalityco/data-packages';

export const getCodeownersData = cache(async () => {
  const packages = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return getCodeownersDatas({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });
});
