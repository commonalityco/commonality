import {
  Package,
  ProjectConfig,
  Violation,
  Dependency,
} from '@commonalityco/types';

function includesAny(a: Set<string>, b: Set<string>): boolean {
  return Array.from(b).some((val) => a.has(val));
}

function getAllDependencies(
  pkg: Package,
  packages: Map<string, Package>
): Dependency[] {
  const deps: Dependency[] = [
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  ];

  for (const dependency of pkg.dependencies) {
    const dependencyPackage = packages.get(dependency.name);
    if (dependencyPackage) {
      deps.push(...getAllDependencies(dependencyPackage, packages));
    }
  }

  return Array.from(new Set(deps.map((dep) => dep.name))).map(
    (name) => deps.find((dep) => dep.name === name)!
  );
}

export function getViolations({
  projectConfig,
  packages,
}: {
  projectConfig: ProjectConfig;
  packages: Package[];
}): Violation[] {
  const violations: Violation[] = [];
  if (!projectConfig.constraints) {
    return violations;
  }

  const packagesMap = new Map(packages.map((pkg) => [pkg.name, pkg]));

  for (const pkg of packages) {
    if (!pkg.tags) {
      continue;
    }

    const directDependencies = Array.from(
      new Set(
        [
          ...pkg.dependencies,
          ...pkg.devDependencies,
          ...pkg.peerDependencies,
        ].map((dep) => dep.name)
      )
    )
      .map((name) => packagesMap.get(name)!)
      .filter(Boolean);

    const constraintsForPackage = projectConfig.constraints.filter(
      (constraint) => {
        return includesAny(new Set(pkg.tags), new Set(constraint.tags));
      }
    );

    const allowsAnyPackage = constraintsForPackage.some((constraint) => {
      if ('allow' in constraint) {
        return constraint.allow.includes('*');
      }
      return false;
    });

    for (const constraint of constraintsForPackage) {
      const hasAllow = 'allow' in constraint;
      const hasDisallow = 'disallow' in constraint;

      if (hasAllow) {
        const allowedTags = new Set(constraint.allow);

        if (allowsAnyPackage) {
          continue;
        }

        for (const dependency of directDependencies) {
          if (!includesAny(allowedTags, new Set(dependency.tags ?? []))) {
            violations.push({
              sourceName: pkg.name,
              targetName: dependency.name,
              matchTags: constraint.tags,
              allowedTags: constraint.allow,
              disallowedTags: hasDisallow ? constraint.disallow : [],
              foundTags: dependency?.tags,
            });
          }
        }
      }

      if (hasDisallow) {
        const disallowedTags = new Set(constraint.disallow);
        const allDependencies = getAllDependencies(pkg, packagesMap);

        for (const dependency of allDependencies) {
          const dependencyPackage = packagesMap.get(dependency.name);
          if (
            dependencyPackage &&
            includesAny(disallowedTags, new Set(dependencyPackage.tags ?? []))
          ) {
            violations.push({
              sourceName: pkg.name,
              targetName: dependency.name,
              matchTags: constraint.tags,
              allowedTags: [],
              disallowedTags: constraint.disallow,
              foundTags: dependencyPackage.tags,
            });
          }
        }
      }
    }
  }

  return violations;
}
