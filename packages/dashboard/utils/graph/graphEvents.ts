import { Dependency, Package } from '@commonalityco/types';
import { TypedEventEmitter } from 'utils/TypedEventEmitter';
import { VirtualElement } from '@popperjs/core';
import {
  CollectionArgument,
  NodeSingular,
  Selector,
  Singular,
} from 'cytoscape';

type Filter =
  | Selector
  | ((ele: Singular, i: number, eles: CollectionArgument) => boolean);

export type GraphEventTypes = {
  PackageClick: [
    options: { data: Package; ref: VirtualElement; element: NodeSingular }
  ];
  DependencyClick: [
    options: {
      data: Dependency & { target: string; source: string };
      ref: VirtualElement;
      element: NodeSingular;
    }
  ];
  GraphClick: [];
  Move: [];
  Focus: [options: { selector: Filter }];
  Show: [options: { selector: Filter }];
  ShowDependents: [];
  ShowDependencies: [];
  ShowAll: [];
  Hide: [options: { selector: Filter }];
  HideAll: [];
  Fit: [options: { selector?: string; padding?: number }];
};

export const graphEvents = new TypedEventEmitter<GraphEventTypes>();
