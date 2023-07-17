import slugify from 'slugify';

/**
 * Takes a tag name and converts it into a URL-friendly slug.
 * Replaces slashes (/) with hyphens (-) and removes any non-URL-safe characters.
 *
 * @param packageName - The package name to be slugified.
 * @returns The slugified package name.
 */
export const slugifyTagName = (tagName: string) => {
  if (!tagName) {
    return '';
  }

  return slugify(tagName, {
    strict: true,
    lower: true,
  });
};
