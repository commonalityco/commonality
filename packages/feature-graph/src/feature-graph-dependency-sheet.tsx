'use client';
import { Constraint, Package, TagsData, Violation } from '@commonalityco/types';
import { DependencySheet } from '@commonalityco/ui-graph';
import {
  constraintsKeys,
  tagsKeys,
  violationsKeys,
} from '@commonalityco/utils-graph/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GraphContext } from './graph-provider.js';

export function FeatureGraphDependencySheet({
  getViolations,
  getConstraints,
  getTagsData,
}: {
  getViolations: () => Promise<Violation[]>;
  getConstraints: () => Promise<Constraint[]>;
  getTagsData: () => Promise<TagsData[]>;
}) {
  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => getTagsData(),
  });

  const { data: violations } = useQuery({
    queryKey: violationsKeys,
    queryFn: () => getViolations(),
  });

  const { data: constraints } = useQuery({
    queryKey: constraintsKeys,
    queryFn: () => getConstraints(),
  });

  const actor = GraphContext.useActorRef();
  const selectedEdge = GraphContext.useSelector(
    (state) => state.context.selectedEdge,
  );

  const dependencyConstraints = useMemo(() => {
    if (!selectedEdge || !constraints) return [];

    const dependencyConstraints =
      constraints?.filter((constraint) => {
        const sourcePackage: Package = selectedEdge.source().data();
        const tagsForPackage = tagsData?.find(
          (data) => data.packageName === sourcePackage.name,
        );

        return tagsForPackage?.tags.includes(constraint.applyTo);
      }) ?? [];

    return dependencyConstraints;
  }, [selectedEdge, constraints]);

  return (
    <DependencySheet
      dependency={selectedEdge?.data()}
      defaultOpen={Boolean(selectedEdge)}
      open={Boolean(selectedEdge)}
      onOpenChange={() => actor.send('UNSELECT')}
      violations={violations ?? []}
      constraints={dependencyConstraints}
      source={selectedEdge?.source().id() ?? 'Source pkg'}
      target={selectedEdge?.target().id() ?? 'Target pkg'}
    />
  );
}

export default FeatureGraphDependencySheet;
