import { LogoNode } from './icons/logo-node.js';
import { LogoReact } from './icons/logo-react.js';
import { LogoNext } from './icons/logo-next.js';
import { PackageType } from '@commonalityco/utils-core';

const ComponentByType = {
  [PackageType.NEXT]: LogoNext,
  [PackageType.REACT]: LogoReact,
  [PackageType.NODE]: LogoNode,
};

export const getIconForPackage = (type: PackageType) => {
  return ComponentByType[type] ?? LogoNode;
};
