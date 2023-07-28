import { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';

const PackageTypeByDependencyName = {
  react: PackageType.REACT,
  next: PackageType.NEXT,
} as const;

export const getPackageType = (pkg: Package) => {
  const deps = Object.keys(pkg.dependencies || {});

  const firstMatchingDep = Object.keys(PackageTypeByDependencyName).find(
    (depName) => deps.some((dep) => dep === depName)
  ) as keyof typeof PackageTypeByDependencyName;

  if (!firstMatchingDep || !PackageTypeByDependencyName[firstMatchingDep]) {
    return PackageType.NODE;
  }

  return PackageTypeByDependencyName[firstMatchingDep];
};
