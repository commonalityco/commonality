import { LocalDependency, PackageType } from '@commonalityco/types';

export const getPackageType = (deps: LocalDependency[]) => {
  const getHasDependency = (depName: string) =>
    deps.some((dep) => dep.name === depName);

  if (getHasDependency('next')) {
    return PackageType.NEXT;
  }

  if (getHasDependency('react')) {
    return PackageType.REACT;
  }

  return PackageType.NODE;
};
