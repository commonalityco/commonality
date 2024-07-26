import { slugifyTagName } from './slugify-tag-name.js';

export const formatTagName = (tagName: string) => {
  if (tagName === '*') {
    return 'All packages';
  }

  return slugifyTagName(tagName);
};
