'use client';
import { ControlBar, GraphDirection } from '@commonalityco/ui-graph';
import { useDirectionQuery, useHighlightQuery } from './graph-hooks';
import { useCallback } from 'react';
import { isGraphLoadingAtom } from '@/atoms/graph';
import { useAtomValue } from 'jotai';

export function StudioControlBar({
  shownCount,
  totalCount,
}: {
  shownCount: number;
  totalCount: number;
}) {
  const { directionQuery, setDirectionQuery } = useDirectionQuery();
  const { highlightQuery, setHighlightQuery } = useHighlightQuery();
  const isLoading = useAtomValue(isGraphLoadingAtom);

  const onDirectionChange = useCallback(
    (direction: GraphDirection) => {
      setDirectionQuery(direction);
    },
    [setDirectionQuery],
  );

  if (isLoading) return null;

  return (
    <ControlBar
      defaultDependencyTypes={highlightQuery ? highlightQuery : undefined}
      onHighlightChange={setHighlightQuery}
      direction={directionQuery}
      onDirectionChange={onDirectionChange}
      shownCount={shownCount}
      totalCount={totalCount}
    />
  );
}