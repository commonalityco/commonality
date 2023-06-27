'use client';
import { useState, useEffect } from 'react';

/**
 * A custom React hook to detect if the user's current color scheme is dark.
 * @returns {boolean} - True if the user's color scheme is dark, false otherwise.
 */
const useIsDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleColorSchemeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    // Add event listener to detect color scheme changes
    mediaQuery.addEventListener('change', handleColorSchemeChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return isDarkMode;
};

export default useIsDarkMode;
