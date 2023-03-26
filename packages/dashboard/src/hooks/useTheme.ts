'use client';

import 'client-only';
import { useMedia } from 'react-use';
import { useAtom } from 'jotai';
import { themeAtom } from 'atoms/theme';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export enum ThemeName {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}

interface UseThemeNameOutput {
  computedTheme?: ThemeName.Dark | ThemeName.Light;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export function useTheme(): UseThemeNameOutput {
  const isDarkOS = useMedia(COLOR_SCHEME_QUERY, false);
  const systemTheme = isDarkOS ? ThemeName.Dark : ThemeName.Light;

  const [controlledTheme, setControlledTheme] = useAtom(themeAtom);

  const getComputedTheme = (): ThemeName.Dark | ThemeName.Light => {
    if (!controlledTheme || controlledTheme === ThemeName.System) {
      return window.COMMONALITY_THEME;
    }

    return controlledTheme ?? systemTheme;
  };

  const computedTheme = getComputedTheme();

  const setDarkThemeClassName = () => {
    document.documentElement.classList.remove(ThemeName.Light);
    document.documentElement.classList.add(ThemeName.Dark);
  };
  const setLightThemeClassName = () => {
    document.documentElement.classList.remove(ThemeName.Dark);
    document.documentElement.classList.add(ThemeName.Light);
  };

  const themeSetter = (chosenTheme: ThemeName) => {
    if (chosenTheme === ThemeName.Dark) {
      setDarkThemeClassName();
      setControlledTheme(ThemeName.Dark);
    } else if (chosenTheme === ThemeName.Light) {
      setLightThemeClassName();
      setControlledTheme(ThemeName.Light);
    } else if (chosenTheme === ThemeName.System) {
      if (systemTheme === ThemeName.Dark) {
        setDarkThemeClassName();
      } else {
        setLightThemeClassName();
      }

      setControlledTheme(ThemeName.System);
    }
  };

  return {
    computedTheme,
    theme: controlledTheme ?? window.COMMONALITY_THEME,
    setTheme: themeSetter,
  };
}
