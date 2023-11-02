import type {
  Violation,
  Dependency,
  TagsData,
  ProjectConfig,
} from '@commonalityco/types';

const edgeKey = (dep: Dependency) => `${dep.source}|${dep.target}`;

export const getAllDependencies = (
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
  constraints = {},
  dependencies = [],
  tagsData = [],
}: {
  constraints?: ProjectConfig['constraints'];
  dependencies: Dependency[];
  tagsData: TagsData[];
}): Promise<Violation[]> {
  const violations: Violation[] = [];

  const tagsByPackageName = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );

  if (Object.keys(constraints).length === 0) {
    return violations;
  }

  const dependenciesBySource: Record<string, string[]> = {};
  for (const dep of dependencies) {
    if (!dependenciesBySource[dep.source]) {
      dependenciesBySource[dep.source] = [];
    }
    dependenciesBySource[dep.source].push(dep.target);
  }

  for (const dependency of dependencies) {
    const constraintsForSourcePackage = Object.entries(constraints).filter(
      ([key]) => {
        if (key === '*') {
          return true;
        }
        const tagsForDependency = tagsByPackageName.get(dependency.source);

        return tagsForDependency?.some((tag) => tag === key);
      },
    );

    const allowsAll = constraintsForSourcePackage.some(
      ([_, constraint]) => 'allow' in constraint && constraint.allow === '*',
    );

    for (const [key, constraint] of constraintsForSourcePackage) {
      const directDependencyPackageNames =
        dependenciesBySource[dependency.source] || [];

      const hasAllow = 'allow' in constraint;
      const hasDisallow = 'disallow' in constraint;
      const allowed =
        hasAllow && constraint?.allow.length ? constraint.allow : undefined;
      const disallowed =
        hasDisallow && constraint?.disallow.length
          ? constraint.disallow
          : undefined;

      if (disallowed === '*') {
        for (const directDependencyPackageName of directDependencyPackageNames) {
          const tagsForTargetPackage = tagsByPackageName.get(
            directDependencyPackageName,
          );

          violations.push({
            sourcePackageName: dependency.source,
            targetPackageName: directDependencyPackageName,
            appliedTo: key,
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
              appliedTo: key,
              allowed: constraint.allow,
              disallowed: hasDisallow ? constraint.disallow : [],
              found: tagsForTargetPackage,
            });
          }
        }
      }

      if (hasDisallow && disallowed) {
        const tagsForTargetPackage = tagsByPackageName.get(dependency.target);

        if (tagsByPackageName) {
          const hasMatch = tagsForTargetPackage?.some((tag) =>
            disallowed.includes(tag),
          );

          if (hasMatch) {
            violations.push({
              sourcePackageName: dependency.source,
              targetPackageName: dependency.target,
              appliedTo: key,
              allowed: hasAllow ? constraint.allow : [],
              disallowed: constraint.disallow,
              found: tagsForTargetPackage,
            });
          }
        }

        const allDependencies = getAllDependencies(
          dependencies,
          dependency.target,
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
              appliedTo: key,
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
