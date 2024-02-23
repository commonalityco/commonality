'use client';
import { Dependency } from '@commonalityco/types';
import { DependencyConstraintsDialog } from './dependency-constraints-dialog';

export function FeatureDependencyConstraintsDialog() {
  return <div />;
  // const { send } = GraphContext.useActorRef();
  // const selectedEdge = GraphContext.useSelector(
  //   (state) => state.context.selectedEdge,
  // );
  // const data: { id: string; dependencies: Dependency[] } | undefined =
  //   selectedEdge?.data();

  // const results = GraphContext.useSelector((state) => state.context.results);

  // const resultsForEdge = results.filter((result) => {
  //   return result.dependencyPath.some((depPath) => {
  //     return (
  //       depPath.source === data?.dependencies[0]?.source &&
  //       depPath.target === data?.dependencies[0]?.target
  //     );
  //   });
  // });

  // return (
  //   <DependencyConstraintsDialog
  //     open={Boolean(selectedEdge && data)}
  //     results={resultsForEdge || []}
  //     dependencies={data?.dependencies || []}
  //     onOpenChange={(open) => {
  //       if (!open) {
  //         send({ type: 'UNSELECT' });
  //       }
  //     }}
  //   />
  // );
}

export default FeatureDependencyConstraintsDialog;
