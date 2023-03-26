import slugify from 'slugify';

export const slugifyPackageName = (packageName: string) => {
  const replacementRegex = /\//g;

  const packageNameWithoutScopeSlash = packageName.replace(
    replacementRegex,
    '-'
  );

  return slugify(packageNameWithoutScopeSlash, { strict: true });
};
