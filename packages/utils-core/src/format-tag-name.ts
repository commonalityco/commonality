import { slugifyTagName } from './slugify-tag-name.js';

export const formatTagName = (tagName: string) => {
  return `#${slugifyTagName(tagName)}`;
};
