import { useEffect, useRef } from 'react';

export type OnScrollIntoViewCallback = (visibleChild: HTMLElement) => void;

function useIntersectionObserver({
  elementIds,
  onIntersect,
}: {
  elementIds: string[];
  onIntersect: OnScrollIntoViewCallback;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          onIntersect(entry.target as HTMLElement);
        }
      });
    };

    const options: IntersectionObserverInit = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    const elementsToObserve = elementIds.map((id) =>
      document.getElementById(id)
    );

    Array.from(elementsToObserve).forEach((child) => {
      observer.observe(child as HTMLElement);
    });

    return () => {
      Array.from(elementsToObserve).forEach((child) => {
        observer.unobserve(child as HTMLElement);
      });
    };
  }, [onIntersect, elementIds]);

  return containerRef;
}

export default useIntersectionObserver;
