import { Package } from '@commonalityco/types';
import { LogoNode } from './icons/logo-node';
import { LogoReact } from './icons/logo-react';
import { LogoNext } from './icons/logo-next';
import { PackageType } from '@commonalityco/utils-core';

const ComponentByType = {
  [PackageType.NEXT]: LogoNext,
  [PackageType.REACT]: LogoReact,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (package_: Package) => {
  return ComponentByType[package_.type] ?? LogoNode;
};
