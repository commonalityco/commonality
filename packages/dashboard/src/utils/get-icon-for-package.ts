import { Dependency, Package } from '@commonalityco/types';
import { LogoNode } from 'images/logo-node';
import { LogoReact } from 'images/logo-react';
import { LogoNext } from 'images/logo-next';

export enum PackageType {
  REACT = 'REACT',
  NEXT = 'NEXT',
  NODE = 'NODE',
}

const DepNamesByPackageType = {
  [PackageType.REACT]: 'react',
  [PackageType.NEXT]: 'next',
};

const typeOrder = [PackageType.NEXT, PackageType.REACT];

export const getType = (pkg: Package) => {
  const depNamesMap: Record<string, boolean> = {};

  const addDepNameToMap = (dep: Dependency) => {
    depNamesMap[dep.name] = true;
  };

  pkg.dependencies.forEach(addDepNameToMap);
  pkg.devDependencies.forEach(addDepNameToMap);
  pkg.peerDependencies.forEach(addDepNameToMap);

  for (const type of typeOrder) {
    if (type === PackageType.NODE) {
      return PackageType.NODE;
    }

    const depName = DepNamesByPackageType[type];

    const matchingDepName = depNamesMap[depName];

    if (!matchingDepName) {
      continue;
    }

    return type;
  }

  return PackageType.NODE;
};

const ComponentByType = {
  [PackageType.NEXT]: LogoNext,
  [PackageType.REACT]: LogoReact,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (pkg: Package) => {
  const type = getType(pkg);

  return ComponentByType[type] ?? LogoNode;
};
