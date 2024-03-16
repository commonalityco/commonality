/* eslint-disable unicorn/no-null */
import { Dependency, Package } from '@commonalityco/types';
import { atom } from 'jotai';

export const selectedDependenciesAtom = atom<Dependency[]>([]);

export const selectedPackagesAtom = atom<Package[]>([]);

export const isGraphLoadingAtom = atom<boolean>(false);
