import { Package } from '@commonalityco/types';
import { atom } from 'jotai';

export const editingPackageAtom = atom<Package | null>(null);
