'use server';
import { getDocumentsData as getDocumentsDataUtility } from '@commonalityco/data-documents';
import { DocumentsData } from '@commonalityco/types';
import { cache } from 'react';
import 'server-only';

export const getDocumentsData = cache(async (): Promise<DocumentsData[]> => {
  return getDocumentsDataUtility({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
});
