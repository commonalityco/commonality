import 'server-only';
import { cache } from 'react';
import {
  getPackageDocumentation,
  getRootDocumentation,
} from '@commonalityco/snapshot';

export const getPackageDocumentationData = cache(async () => {
  return getPackageDocumentation();
});

export const getRootDocumentationData = cache(async () => {
  return getRootDocumentation();
});
