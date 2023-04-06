import { createGraphManager, GraphManager } from 'utils/graph/graphManager';
import { Package } from '@commonalityco/types';
import { Core, CollectionReturnValue, NodeCollection } from 'cytoscape';
import { atom } from 'jotai';

export const graphManagerAtom = atom<GraphManager | undefined>(undefined);

export const visibleElementsAtom = atom<NodeCollection | undefined>(undefined);
