import { useState, useEffect } from 'react';

export function useMediaQuery(
  query: string,
  defaultMatches: boolean = false,
): boolean {
  const [matches, setMatches] = useState<boolean>(defaultMatches);

  useEffect(() => {
    // Ensure SSR safety
    if (typeof window !== 'undefined') {
      const mediaQueryList: MediaQueryList = window.matchMedia(query);
      setMatches(mediaQueryList.matches);

      // Event listener for changes
      const handleChange = (event: MediaQueryListEvent): void => {
        setMatches(event.matches);
      };

      mediaQueryList.addEventListener('change', handleChange);

      // Cleanup
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }
  }, [query]);

  return matches;
}
