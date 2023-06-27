import { useEffect, useRef } from 'react';

interface UseElementVisibilityOptions {
  /**
   * An array of element IDs that correspond to the sections.
   */
  elementIds: string[];

  /**
   * A callback function that will be called with the ID of the visible element.
   */
  onElementVisible: (id: string | null) => void;

  /**
   * An optional element to use as the observer's root.
   * When not provided, the observer will use the viewport.
   */
  root?: HTMLElement | undefined;
}

/**
 * A custom React hook to manage the visibility of elements
 * when they are scrolled into the viewport or a specified root element.
 *
 * @param {UseElementVisibilityOptions} options - The options for the hook.
 * @returns {Map<string, HTMLDivElement>} A map of element references indexed by their corresponding element ID.
 */
export const useElementVisibility = ({
  elementIds,
  onElementVisible,
  root,
}: UseElementVisibilityOptions) => {
  const elementReferences = useRef(new Map<string, HTMLDivElement>());
  const observer = useRef<IntersectionObserver | undefined>();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onElementVisible(entry.target.id);
          }
        }
      },
      { root, threshold: [0.4, 0.6] }
    );

    for (const reference of elementReferences.current.values()) {
      observer.current.observe(reference);
    }

    return () => {
      for (const reference of elementReferences.current.values()) {
        observer.current?.unobserve(reference);
      }
    };
  }, [elementIds, onElementVisible, root]);

  return elementReferences.current;
};
