'use server';
import { getDocumentsData as getDocumentsDataUtility } from '@commonalityco/data-documents';
import { cache } from 'react';
import 'server-only';

export const getDocumentsData = cache(async () => {
  const documentsData = await getDocumentsDataUtility({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });

  return documentsData;
});
