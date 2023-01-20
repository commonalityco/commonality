import type { ProjectConfig, Package, Violation } from '@commonalityco/types';
import intersection from 'lodash.intersection';
import { traverseGraph } from '@commonalityco/traverse';

export const getConstraintViolations = ({
  packages,
  config,
}: {
  packages: Package[];
  config: ProjectConfig;
}): Violation[] => {
  const violationsByPackageName = new Map<string, Violation[]>();

  for (const constraint of config?.constraints ?? []) {
    const packagesWithConstraint = packages.filter(
      (pkg) => intersection(pkg.tags, constraint.tags).length > 0
    );

    for (const packageWithConstraint of packagesWithConstraint) {
      traverseGraph({
        root: packageWithConstraint,
        packages,
        visit(node, dependencies) {
          const packageViolations: Violation[] = [];

          for (const dependency of dependencies) {
            const hasDisallowedTag =
              intersection(dependency.tags, constraint.allow).length > 0;

            if (hasDisallowedTag) {
              continue;
            } else {
              packageViolations.push({
                path: node.path,
                sourceName: node.name,
                targetName: dependency.name,
                constraintTags: constraint.tags || [],
                allowedTags: constraint.allow || [],
                targetTags: dependency.tags,
              });
            }
          }

          violationsByPackageName.set(node.name, packageViolations);
        },
      });
    }
  }

  const violations = Array.from(violationsByPackageName.values()).flat();

  return violations;
};
