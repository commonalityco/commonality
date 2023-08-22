'use client';
import { Package } from '@commonalityco/types';
import dynamic from 'next/dynamic';

const CreateTagsButton = dynamic(() => import('./CreateTagsButton'));

export const getCreateTagsButton = (pkg: Package) => {
  return <CreateTagsButton pkg={pkg} />;
};
