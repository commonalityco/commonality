import { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';

const PackageTypeByDependencyName = {
  react: PackageType.REACT,
  next: PackageType.NEXT,
} as const;

export const getPackageType = (pkg: Package) => {
  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});

  const allDeps = new Set([...deps, ...devDeps, ...peerDeps]);

  const firstMatchingDep = Object.keys(PackageTypeByDependencyName).find(
    (depName) => allDeps.has(depName)
  ) as keyof typeof PackageTypeByDependencyName;

  if (!firstMatchingDep || !PackageTypeByDependencyName[firstMatchingDep]) {
    return PackageType.NODE;
  }

  return PackageTypeByDependencyName[firstMatchingDep];
};
