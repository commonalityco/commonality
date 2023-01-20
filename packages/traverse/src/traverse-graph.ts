import type { Package } from '@commonalityco/types';
import treeverse from 'treeverse';
import memoize from 'lodash.memoize';

export const traverseGraph = ({
  root,
  visit,
  packages,
}: {
  visit?: (node: Package, dependencies: Package[]) => void;
  root: Package;
  packages: Package[];
}): void => {
  treeverse.breadth<Package>({
    tree: root,
    visit(node) {
      return node;
    },
    getChildren: memoize(
      (node) => {
        const dependencyNames = node.dependencies.map((dep) => dep.name);
        const devDependencyNames = node.devDependencies.map((dep) => dep.name);
        const peerDependencyNames = node.peerDependencies.map(
          (dep) => dep.name
        );
        const allDependencyNames = new Set([
          ...dependencyNames,
          ...devDependencyNames,
          ...peerDependencyNames,
        ]);
        const dependencies = packages.filter((pkg) =>
          allDependencyNames.has(pkg.name)
        );

        visit?.(node, dependencies);

        return dependencies;
      },
      (node) => node.name
    ),
  });
};
