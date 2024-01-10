import { PackageType } from '@commonalityco/utils-core';
import { LogoNode } from './images/logo-node';
import { LogoReact } from './images/logo-react';
import { LogoNext } from './images/logo-next';

const ComponentByType = {
  [PackageType.NEXT]: LogoNext,
  [PackageType.REACT]: LogoReact,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (type: PackageType) => {
  return ComponentByType[type] ?? LogoNode;
};
