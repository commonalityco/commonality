'use server';
import { getDocumentsData as getDocumentsDataUtility } from '@commonalityco/data-documents';
import { DocumentsData } from '@commonalityco/types';
import { documentsKeys } from '@commonalityco/utils-graph/query-keys';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import 'server-only';

export const getDocumentsData = cache(async (): Promise<DocumentsData[]> => {
  return unstable_cache(
    async () => {
      return getDocumentsDataUtility({
        rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
      });
    },
    [`${process.env.COMMONALITY_ROOT_DIRECTORY}-documents`],
    {
      tags: documentsKeys,
    },
  )();
});
