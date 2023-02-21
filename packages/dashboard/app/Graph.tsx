'use client';
import 'client-only';
import { useEffect, useRef } from 'react';
import { ElementDefinition } from 'cytoscape';
import { useTheme } from '@/hooks/useTheme';
import { createGraphManager } from '@/utils/graph/graphManager';
import { useAtomValue } from 'jotai';
import { themeAtom } from '@/atoms/theme';

const graphManager = createGraphManager();

export function Graph({ elements }: { elements: ElementDefinition[] }) {
  const { theme, computedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !computedTheme) return;

    graphManager.init({
      elements,
      container: ref.current,
      theme: computedTheme,
    });
  }, [elements, computedTheme]);

  useEffect(() => {
    if (!computedTheme) return;

    graphManager.setTheme(computedTheme);
  }, [computedTheme]);

  return <div className="h-full dark:bg-zinc-800 bg-zinc-50" ref={ref} />;
}
