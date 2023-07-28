import { Dependency, Package } from '@commonalityco/types';
import { LogoNode } from './icons/logo-node';
import { LogoReact } from './icons/logo-react';
import { LogoNext } from './icons/logo-next';
import { LogoStorybook } from './icons/logo-storybook';

export enum PackageType {
  REACT = 'REACT',
  NEXT = 'NEXT',
  NODE = 'NODE',
  STORYBOOK = 'STORYBOOK',
}

const DepNamesByPackageType = {
  [PackageType.REACT]: 'react',
  [PackageType.NEXT]: 'next',
  [PackageType.STORYBOOK]: 'storybook',
};

const typeOrder = [PackageType.STORYBOOK, PackageType.NEXT, PackageType.REACT];

export const getType = (package_: Package) => {
  const depNamesMap: Record<string, boolean> = {};

  const addDepNameToMap = (dep: Dependency) => {
    depNamesMap[dep.name] = true;
  };

  for (const dep of package_.dependencies ?? []) addDepNameToMap(dep);

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
  [PackageType.STORYBOOK]: LogoStorybook,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (package_: Package) => {
  const type = getType(package_);

  return ComponentByType[type] ?? LogoNode;
};
