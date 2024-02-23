'use client';
import { isGraphLoadingAtom } from '@/atoms/graph';
import { GraphDirection } from '@commonalityco/ui-graph';
import { useSetAtom } from 'jotai';
import { compressToEncodedURIComponent } from 'lz-string';
import { parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { useEffect, useTransition } from 'react';

export const usePackagesQuery = () => {
  const [isLoading, startTransition] = useTransition();
  const setLoading = useSetAtom(isGraphLoadingAtom);
  const [packagesQuery, setPackagesQueryRaw] = useQueryState(
    'packages',
    parseAsString.withOptions({ startTransition, shallow: false }),
  );

  useEffect(() => {
    console.log({ isLoading });
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const setPackagesQuery = (packageNames: string[]) => {
    const compressed = compressToEncodedURIComponent(
      JSON.stringify(packageNames),
    );

    setPackagesQueryRaw(compressed);
  };

  return { setPackagesQuery, packagesQuery };
};

export const useDirectionQuery = () => {
  const [isLoading, startTransition] = useTransition();
  const setLoading = useSetAtom(isGraphLoadingAtom);
  const [directionQuery, setDirectionQuery] = useQueryState(
    'direction',
    parseAsStringEnum<GraphDirection>(Object.values(GraphDirection))
      .withDefault(GraphDirection.TopToBottom)
      .withOptions({ startTransition, shallow: false }),
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return { setDirectionQuery, directionQuery };
};
