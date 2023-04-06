export const formatPackageName = (
  name: string,
  options: { stripScope: boolean }
) => {
  const { stripScope = false } = options;

  if (name.includes('/') && stripScope) {
    return name.split('/')[1];
  }

  return name;
};
