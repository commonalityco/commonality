'use server';
import { getDocumentsData as getDocumentsDataUtility } from '@commonalityco/data-documentation';
import { cache } from 'react';
import 'server-only';
import { getRootDirectory } from '@commonalityco/data-project';

export const getDocumentsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const documentsData = await getDocumentsDataUtility({ rootDirectory });

  return documentsData;
});
