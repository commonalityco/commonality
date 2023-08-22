'use client';
import { TooltipPackage } from '@commonalityco/ui-graph';
import { GraphContext } from './graph-provider.js';

export function FeatureGraphPackageTooltip() {
  const actor = GraphContext.useActorRef();
  const hoveredRenderNode = GraphContext.useSelector(
    (state) => state.context.hoveredRenderNode,
  );
  const hoveredTraversalNode = GraphContext.useSelector(
    (state) => state.context.hoveredTraversalNode,
  );

  return (
    <>
      {hoveredRenderNode && hoveredTraversalNode && (
        <TooltipPackage
          renderNode={hoveredRenderNode}
          traversalNode={hoveredTraversalNode}
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
      )}
    </>
  );
}

export default FeatureGraphPackageTooltip;
