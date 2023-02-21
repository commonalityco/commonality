import { ThemeName } from '@/constants/ThemeName';
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<ThemeName | undefined>(
  'commonality-theme',
  undefined
);
