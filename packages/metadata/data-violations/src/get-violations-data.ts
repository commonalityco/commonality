import { getTagsData } from '@commonalityco/data-tags';
import {
  Package,
  Violation,
  Dependency,
  ProjectConfig,
  TagsData,
} from '@commonalityco/types';
import { getPackages } from '@commonalityco/data-packages';
import { getProjectConfig } from '@commonalityco/data-project';

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
      .map((name) => packagesMap.get(name)!)
      .filter(Boolean);

    const constraintsForPackage = projectConfig.constraints.filter(
      (constraint) => {
        return tagsForPkg
          ? includesAny(new Set(tagsForPkg.tags), new Set([constraint.tag]))
          : [];
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
          const tagsForTargetPkg =
            tagData.find((data) => data.packageName === dependency.name)
              ?.tags ?? [];

          if (!includesAny(allowedTags, new Set(tagsForTargetPkg))) {
            violations.push({
              sourcePackageName: pkg.name,
              targetPackageName: dependency.name,
              constraintTag: constraint.tag,
              allowedTags: constraint.allow,
              disallowedTags: hasDisallow ? constraint.disallow : [],
              foundTags: tagsForTargetPkg,
            });
          }
        }
      }

      if (hasDisallow) {
        const disallowedTags = new Set(constraint.disallow);
        const allDependencies = getAllDependencies(pkg, packagesMap);

        for (const dependency of allDependencies) {
          const dependencyPackage = packagesMap.get(dependency.name);
          const tagsForTargetPkg =
            tagData.find((data) => data.packageName === dependencyPackage?.name)
              ?.tags ?? [];

          if (
            dependencyPackage &&
            includesAny(disallowedTags, new Set(tagsForTargetPkg))
          ) {
            violations.push({
              sourcePackageName: pkg.name,
              targetPackageName: dependency.name,
              constraintTag: constraint.tag,
              allowedTags: [],
              disallowedTags: constraint.disallow,
              foundTags: tagsForTargetPkg,
            });
          }
        }
      }
    }
  }

  return violations;
}
