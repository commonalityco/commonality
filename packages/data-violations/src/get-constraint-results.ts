import type {
  Dependency,
  TagsData,
  ProjectConfig,
  ConstraintResult,
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

function hasIntersection<T>(setA: Set<T>, setB: Set<T>): boolean {
  // Iterate over the smaller set for efficiency
  const [smallerSet, largerSet] =
    setA.size < setB.size ? [setA, setB] : [setB, setA];

  for (const element of smallerSet) {
    if (largerSet.has(element)) {
      return true; // Found a common element
    }
  }

  return false; // No common elements found
}

export async function getConstraintResults({
  constraints = {},
  dependencies = [],
  tagsData = [],
}: {
  constraints?: ProjectConfig['constraints'];
  dependencies: Dependency[];
  tagsData: TagsData[];
}): Promise<ConstraintResult[]> {
  const filters = Object.keys(constraints);
  const violations: ConstraintResult[] = [];
  const tagsByPackageName = new Map<string, Set<string>>(
    tagsData.map((data) => [data.packageName, new Set(data.tags)]),
  );

  if (!constraints || Object.keys(constraints).length === 0) {
    return violations;
  }

  const dependenciesBySource = new Map<string, Set<string>>();

  for (const dep of dependencies) {
    const existingDependenciesForSource = dependenciesBySource.get(dep.source);

    if (existingDependenciesForSource) {
      existingDependenciesForSource.add(dep.target);
    } else {
      dependenciesBySource.set(dep.source, new Set([dep.target]));
    }
  }

  return Promise.all(
    filters
      .flatMap((matchingPattern) => {
        const constraint = constraints[matchingPattern];

        if (!constraint) {
          return;
        }

        const dependenciesForPattern = dependencies.filter((dep) => {
          if (matchingPattern === '*') {
            return true;
          }

          const tagsForDependency = tagsByPackageName.get(dep.source);

          if (!tagsForDependency) {
            return false;
          }

          return tagsForDependency.has(matchingPattern);
        });

        const allowAll = 'allow' in constraint && constraint.allow === '*';
        const disallowAll =
          'disallow' in constraint && constraint.disallow === '*';

        return dependenciesForPattern.flatMap(
          (dependency): ConstraintResult => {
            const tagsForTarget = tagsByPackageName.get(dependency.target);
            const foundTags = tagsForTarget ? [...tagsForTarget] : undefined;

            if (disallowAll) {
              return {
                foundTags,
                dependency,
                constraint,
                isValid: false,
              };
            }

            if (allowAll) {
              return {
                foundTags,
                dependency,
                constraint,
                isValid: true,
              };
            }

            const disallowedTags =
              'disallow' in constraint && Array.isArray(constraint.disallow)
                ? new Set(constraint.disallow)
                : undefined;

            if (disallowedTags && tagsForTarget) {
              const hasMatch = hasIntersection(tagsForTarget, disallowedTags);

              // If direct dependency is disallowed, return false
              if (hasMatch) {
                return {
                  foundTags,
                  dependency,
                  constraint,
                  isValid: false,
                };
              }

              // If any transitive dependency is disallowed, return false
              const allDependencies = getAllDependencies(
                dependencies,
                dependency.target,
              );

              for (const transitiveDependency of allDependencies) {
                const tagsForTransitiveTarget = tagsByPackageName.get(
                  transitiveDependency.target,
                );

                if (!tagsForTransitiveTarget) {
                  continue;
                }

                const hasMatch = hasIntersection(
                  tagsForTransitiveTarget,
                  disallowedTags,
                );

                if (hasMatch) {
                  return {
                    dependency,
                    constraint,
                    isValid: false,
                    foundTags,
                  };
                }
              }
            }

            const allowedTags =
              'allow' in constraint && Array.isArray(constraint.allow)
                ? new Set(constraint.allow)
                : undefined;

            if (allowedTags && tagsForTarget) {
              const hasMatch = hasIntersection(tagsForTarget, allowedTags);

              return {
                dependency,
                constraint,
                isValid: hasMatch,
                foundTags,
              };
            }

            return {
              dependency,
              constraint,
              isValid: true,
              foundTags,
            };
          },
        );
      })
      // eslint-disable-next-line unicorn/prefer-native-coercion-functions
      .filter((result): result is ConstraintResult => Boolean(result)),
  );
}
