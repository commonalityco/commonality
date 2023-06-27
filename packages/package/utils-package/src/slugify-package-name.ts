import slugify from 'slugify';

/**
 * Takes a package name and converts it into a URL-friendly slug.
 * Replaces slashes (/) with hyphens (-) and removes any non-URL-safe characters.
 *
 * @param packageName - The package name to be slugified.
 * @returns The slugified package name.
 */
export const slugifyPackageName = (packageName: string) => {
  const replacementRegex = /\//g;

  if (!packageName) {
    return '';
  }

  const packageNameWithoutScopeSlash = packageName.replace(
    replacementRegex,
    '-'
  );

  return slugify(packageNameWithoutScopeSlash, { strict: true });
};
