import { LogoNode } from './ui/images/logo-node';
import { LogoReact } from './ui/images/logo-react';
import { LogoNext } from './ui/images/logo-next';
import { PackageType } from './constants';

const ComponentByType = {
  [PackageType.NEXT]: LogoNext,
  [PackageType.REACT]: LogoReact,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (type: PackageType) => {
  return ComponentByType[type] ?? LogoNode;
};
