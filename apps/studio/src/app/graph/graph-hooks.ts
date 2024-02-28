'use client';
import { isGraphLoadingAtom } from '@/atoms/graph';
import { GraphDirection } from '@commonalityco/ui-graph';
import { DependencyType } from '@commonalityco/utils-core';
import { useSetAtom } from 'jotai';
import { compressToEncodedURIComponent } from 'lz-string';
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from 'nuqs';
import { useEffect, useTransition } from 'react';

export const usePackagesQuery = () => {
  const [isLoading, startTransition] = useTransition();
  const setLoading = useSetAtom(isGraphLoadingAtom);
  const [packagesQuery, setPackagesQueryRaw] = useQueryState(
    'packages',
    parseAsString.withOptions({ startTransition }),
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const setPackagesQuery = (packageNames: string[]) => {
    const compressed = compressToEncodedURIComponent(
      JSON.stringify(packageNames),
    );

    setPackagesQueryRaw(compressed);
  };

  return {
    setPackagesQuery,
    packagesQuery,
  };
};

export const useDirectionQuery = () => {
  const [isLoading, startTransition] = useTransition();
  const setLoading = useSetAtom(isGraphLoadingAtom);
  const [directionQuery, setDirectionQuery] = useQueryState(
    'direction',
    parseAsStringEnum<GraphDirection>(Object.values(GraphDirection))
      .withDefault(GraphDirection.TopToBottom)
      .withOptions({ startTransition }),
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return { setDirectionQuery, directionQuery };
};

export const highlightParser = parseAsArrayOf(
  parseAsStringEnum<DependencyType>(Object.values(DependencyType)),
);

export const useHighlightQuery = () => {
  const [highlightQuery, setHighlightQuery] = useQueryState(
    'highlight',
    highlightParser,
  );

  return { setHighlightQuery, highlightQuery };
};
