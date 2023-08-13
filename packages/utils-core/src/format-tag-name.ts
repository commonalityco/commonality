import { slugifyTagName } from './slugify-tag-name';

export const formatTagName = (tagName: string) => {
  return `#${slugifyTagName(tagName)}`;
};
