import { BlockType } from '@commonalityco/utils-core';
import { LogoNode } from './images/logo-node';
import { LogoReact } from './images/logo-react';
import { LogoNext } from './images/logo-next';

const ComponentByType = {
  [BlockType.NEXT]: LogoNext,
  [BlockType.REACT]: LogoReact,
  [BlockType.NODE]: LogoNode,
};

export const getIconForPackage = (type: BlockType) => {
  return ComponentByType[type] ?? LogoNode;
};
