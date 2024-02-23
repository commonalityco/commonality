import { Dependency, Package } from '@commonalityco/types';
import { atom } from 'jotai';

export const editingPackageAtom = atom<Package | null>(null);

export const activeDependencyAtom = atom<Dependency | null>(null);

export const selectedPackagesAtom = atom<Package[]>([]);

export const isGraphLoadingAtom = atom<boolean>(false);
