'use client';
import { TooltipPackage } from './tooltip-package';
import { GraphContext } from '@commonalityco/ui-graph';
import { GraphTooltip } from './graph-tooltip';
import { Package } from '@commonalityco/types';

export function FeatureGraphPackageTooltip({
  onEditTags,
  onOpenPackageJson,
}: {
  onOpenPackageJson: (pkg: Package) => void;
  onEditTags: (pkg: Package) => void;
}) {
  const actor = GraphContext.useActorRef();
  const selectedRenderNode = GraphContext.useSelector(
    (state) => state.context.selectedRenderNode,
  );
  const selectedTraversalNode = GraphContext.useSelector(
    (state) => state.context.selectedTraversalNode,
  );
  const pkg: Package = selectedRenderNode?.data();
  const dependentsCount = selectedTraversalNode?.incomers().nodes().length;
  const dependenciesCount = selectedTraversalNode?.outgoers().nodes().length;

  return (
    <>
      {selectedRenderNode && selectedTraversalNode && (
        <GraphTooltip
          key={pkg.name}
          open
          placement="bottom"
          reference={selectedRenderNode.popperRef()}
          content={
            <TooltipPackage
              pkg={pkg}
              onOpenPackageJson={onOpenPackageJson}
              onEditTags={onEditTags}
              dependentsCount={Number(dependentsCount)}
              dependenciesCount={Number(dependenciesCount)}
              onFocus={(package_) =>
                actor.send({
                  type: 'FOCUS',
                  selector: `node[id="${package_.name}"]`,
                })
              }
              onHide={(package_) => {
                actor.send({
                  type: 'HIDE',
                  selector: `node[id="${package_.name}"]`,
                });
              }}
              onDependenciesHide={(package_) => {
                actor.send({ type: 'HIDE_DEPENDENCIES', pkg: package_ });
              }}
              onDependenciesShow={(package_) => {
                actor.send({ type: 'SHOW_DEPENDENCIES', pkg: package_ });
              }}
              onDependentsHide={(package_) => {
                actor.send({ type: 'HIDE_DEPENDANTS', pkg: package_ });
              }}
              onDependentsShow={(package_) => {
                actor.send({ type: 'SHOW_DEPENDANTS', pkg: package_ });
              }}
            />
          }
        />
      )}
    </>
  );
}

export default FeatureGraphPackageTooltip;
