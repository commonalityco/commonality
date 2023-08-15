import {
  Violation,
  Dependency,
  TagsData,
  Constraint,
} from '@commonalityco/types';

const edgeKey = (dep: Dependency) => `${dep.source}|${dep.target}`;

const getAllDependencies = (
  dependencies: Dependency[],
  packageName: string,
  visitedNodes: Set<string> = new Set(),
  resultEdges: Set<string> = new Set(),
): Dependency[] => {
  if (visitedNodes.has(packageName)) {
    return [];
  }
  visitedNodes.add(packageName);

  const connectedDependencies = dependencies.filter(
    (dep) => dep.source === packageName && !resultEdges.has(edgeKey(dep)),
  );

  for (const dep of connectedDependencies) {
    resultEdges.add(edgeKey(dep));
    getAllDependencies(dependencies, dep.target, visitedNodes, resultEdges);
  }

  return [...resultEdges]
    .map((key) => {
      const [source, target] = key.split('|');

      return dependencies.find(
        (dep) => dep.source === source && dep.target === target,
      );
    })
    .filter((dep): dep is Dependency => !!dep);
};

export async function getViolations({
  constraints = [],
  dependencies = [],
  tagsData = [],
}: {
  constraints?: Constraint[];
  dependencies: Dependency[];
  tagsData: TagsData[];
}): Promise<Violation[]> {
  const violations: Violation[] = [];

  const tagsByPackageName = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );

  if (constraints.length === 0) {
    return violations;
  }

  for (const dependency of dependencies) {
    const constraintsForDependency = constraints.filter((constraint) => {
      if (constraint.applyTo === '*') {
        return true;
      }
      const tagsForDependency = tagsByPackageName.get(dependency.source);

      return tagsForDependency?.some((tag) => tag === constraint.applyTo);
    });

    const allowsAll = constraintsForDependency.some(
      (constraint) => 'allow' in constraint && constraint.allow === '*',
    );

    for (const constraint of constraintsForDependency) {
      const directDependencyPackageNames = dependencies
        .filter((dep) => dep.source === dependency.source)
        .map((dep) => dep.target);

      const hasAllow = 'allow' in constraint;
      const hasDisallow = 'disallow' in constraint;
      const allowed = hasAllow ? constraint.allow : undefined;
      const disallowed = hasDisallow ? constraint.disallow : undefined;

      if (disallowed === '*') {
        for (const directDependencyPackageName of directDependencyPackageNames) {
          const tagsForTargetPackage = tagsByPackageName.get(
            directDependencyPackageName,
          );

          violations.push({
            sourcePackageName: dependency.source,
            targetPackageName: directDependencyPackageName,
            appliedTo: constraint.applyTo,
            allowed: hasAllow ? constraint.allow : [],
            disallowed: hasDisallow ? constraint.disallow : [],
            found: tagsForTargetPackage,
          });
        }

        continue;
      }

      if (hasAllow && allowed !== '*') {
        if (allowsAll) {
          continue;
        }

        const directDependencyPackageNames = dependencies
          .filter((dep) => dep.source === dependency.source)
          .map((dep) => dep.target);

        for (const directDependencyPackageName of directDependencyPackageNames) {
          const tagsForTargetPackage = tagsByPackageName.get(
            directDependencyPackageName,
          );

          const hasMatch = Boolean(
            tagsForTargetPackage?.some(
              (tag) => allowed?.some((allowedTag) => allowedTag === tag),
            ),
          );

          if (!hasMatch) {
            violations.push({
              sourcePackageName: dependency.source,
              targetPackageName: directDependencyPackageName,
              appliedTo: constraint.applyTo,
              allowed: constraint.allow,
              disallowed: hasDisallow ? constraint.disallow : [],
              found: tagsForTargetPackage,
            });
          }
        }
      }

      if (hasDisallow && disallowed) {
        const allDependencies = getAllDependencies(
          dependencies,
          dependency.source,
        );

        for (const targetDependency of allDependencies) {
          const tagsForTargetPackage = tagsByPackageName.get(
            targetDependency.target,
          );

          const hasMatch = tagsForTargetPackage?.some((tag) =>
            disallowed.includes(tag),
          );

          if (hasMatch) {
            violations.push({
              sourcePackageName: dependency.source,
              targetPackageName: targetDependency.target,
              appliedTo: constraint.applyTo,
              allowed: hasAllow ? constraint.allow : [],
              disallowed: constraint.disallow,
              found: tagsForTargetPackage,
            });
          }
        }
      }
    }
  }

  return violations;
}
