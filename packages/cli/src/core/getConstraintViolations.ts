import treeverse from 'treeverse';
import type {
  Config,
  LocalPackage,
  LocalViolation,
} from '@commonalityco/types';
import intersection from 'lodash.intersection';

export const getConstraintViolations = (
  packages: LocalPackage[],
  config: Config
): LocalViolation[] => {
  const violations: LocalViolation[] = [];

  for (const constraint of config?.constraints || []) {
    const packagesWithConstraint = packages.filter((pkg) =>
      pkg.tags.includes(constraint.tag)
    );

    for (const packageWithConstraint of packagesWithConstraint) {
      treeverse.depth({
        tree: packageWithConstraint,
        leave(node: {
          name: string;
          children: Array<typeof packageWithConstraint>;
        }) {
          if (!node.children.length) {
            return;
          }

          for (const child of node.children) {
            if (intersection(child.tags, constraint.allow).length > 0) {
              continue;
            } else {
              violations.push({
                source: node.name,
                target: child.name,
                targetTags: child.tags,
                path: child.path,
                constraint,
              });
            }
          }
        },
        visit(node: typeof packageWithConstraint) {
          const dependencyNames = node.dependencies.map((dep) => dep.name);
          const devDependencyNames = node.devDependencies.map(
            (dep) => dep.name
          );
          const peerDependencyNames = node.peerDependencies.map(
            (dep) => dep.name
          );

          const allDependencyNames = [
            ...dependencyNames,
            ...devDependencyNames,
            ...peerDependencyNames,
          ];

          const children = packages.filter((pkg) => {
            return allDependencyNames.includes(pkg.name);
          });

          return { name: node.name, children };
        },
        getChildren(node: { children: Array<typeof packageWithConstraint> }) {
          return node.children;
        },
      });
    }
  }

  return violations;
};
