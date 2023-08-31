'use client';
import { TooltipPackage } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider.js';
import { GraphTooltip } from '@commonalityco/ui-graph/graph-tooltip';
import { Package } from '@commonalityco/types';

export function FeatureGraphPackageTooltip() {
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
        <GraphTooltip element={selectedRenderNode}>
          <TooltipPackage
            pkg={pkg}
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
        </GraphTooltip>
      )}
    </>
  );
}

export default FeatureGraphPackageTooltip;
