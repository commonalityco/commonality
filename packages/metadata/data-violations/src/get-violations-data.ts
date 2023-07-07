import {
  Package,
  Violation,
  Dependency,
  ProjectConfig,
  TagsData,
} from '@commonalityco/types';

function includesAny<Value>(a: Set<Value>, b: Set<Value>): boolean {
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

  const dependencyNames = deps.map((dep) => dep.name);
  const deduplicatedDependencyNames = [...new Set(dependencyNames)];

  const dependencies = deduplicatedDependencyNames
    .map((name) => deps.find((dep) => dep.name === name))
    .filter((dep): dep is Dependency => dep !== undefined);

  return dependencies;
}

export async function getViolationsData({
  projectConfig,
  packages,
  tagData,
}: {
  projectConfig: ProjectConfig;
  packages: Package[];
  tagData: TagsData[];
}): Promise<Violation[]> {
  const violations: Violation[] = [];
  if (!projectConfig.constraints) {
    return violations;
  }

  const packagesMap = new Map(packages.map((pkg) => [pkg.name, pkg]));

  for (const pkg of packages) {
    const tagsForPkg = tagData.find((data) => data.packageName === pkg.name);

    if (!tagsForPkg) {
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
      .map((name) => packagesMap.get(name))
      .filter((pkg): pkg is Package => pkg !== undefined);

    const constraintsForPackage = projectConfig.constraints.filter(
      (constraint) => {
        return tagsForPkg
          ? includesAny(new Set(tagsForPkg.tags), new Set([constraint.applyTo]))
          : [];
      }
    );

    const allowsAnyPackage = constraintsForPackage.some((constraint) => {
      if ('allow' in constraint) {
        return constraint.allow === '*';
      }
      return false;
    });

    for (const constraint of constraintsForPackage) {
      const hasAllow = 'allow' in constraint;
      const hasDisallow = 'disallow' in constraint;
      const allowed = hasAllow ? constraint.allow : undefined;
      const disallowed = hasDisallow ? constraint.disallow : undefined;

      if (disallowed === '*') {
        for (const dependency of directDependencies) {
          const tagsForTargetPkg =
            tagData.find((data) => data.packageName === dependency.name)
              ?.tags ?? [];

          violations.push({
            sourcePackageName: pkg.name,
            targetPackageName: dependency.name,
            appliedTo: constraint.applyTo,
            allowed: hasAllow ? constraint.allow : [],
            disallowed: hasDisallow ? constraint.disallow : [],
            found: tagsForTargetPkg,
          });
        }
        continue;
      }

      if (hasAllow) {
        if (allowsAnyPackage) {
          continue;
        }

        for (const dependency of directDependencies) {
          const tagsForTargetPkg =
            tagData.find((data) => data.packageName === dependency.name)
              ?.tags ?? [];

          if (!includesAny(new Set(allowed), new Set(tagsForTargetPkg))) {
            violations.push({
              sourcePackageName: pkg.name,
              targetPackageName: dependency.name,
              appliedTo: constraint.applyTo,
              allowed: constraint.allow,
              disallowed: hasDisallow ? constraint.disallow : [],
              found: tagsForTargetPkg,
            });
          }
        }
      }

      if (hasDisallow) {
        const allDependencies = getAllDependencies(pkg, packagesMap);

        for (const dependency of allDependencies) {
          const dependencyPackage = packagesMap.get(dependency.name);
          const tagsForTargetPkg =
            tagData.find((data) => data.packageName === dependencyPackage?.name)
              ?.tags ?? [];

          if (includesAny(new Set(disallowed), new Set(tagsForTargetPkg))) {
            violations.push({
              sourcePackageName: pkg.name,
              targetPackageName: dependency.name,
              appliedTo: constraint.applyTo,
              allowed: hasAllow ? constraint.allow : [],
              disallowed: constraint.disallow,
              found: tagsForTargetPkg,
            });
          }
        }
      }
    }
  }

  return violations;
}
