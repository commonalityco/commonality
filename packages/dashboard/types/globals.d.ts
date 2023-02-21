import { ThemeName } from '@/constants/ThemeName';

declare global {
  interface Window {
    COMMONALITY_THEME: ThemeName.Dark | ThemeName.Light;
  }
}
