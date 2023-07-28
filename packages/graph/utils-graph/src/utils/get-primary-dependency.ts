import { Dependency, Package } from '@commonalityco/types';

export enum PrimaryDependency {
  REACT = 'REACT',
  NEXT = 'NEXT',
  NODE = 'NODE',
}

const DepNamesByPrimaryDependency = {
  [PrimaryDependency.REACT]: 'react',
  [PrimaryDependency.NEXT]: 'next',
};

const typeOrder = [
  PrimaryDependency.NEXT,
  PrimaryDependency.REACT,
  PrimaryDependency.NODE,
];

export const getPrimaryDependency = (pkg: Package): PrimaryDependency => {
  const depNamesMap: Record<string, boolean> = {};

  const addDepNameToMap = (dep: Dependency) => {
    depNamesMap[dep.name] = true;
  };

  for (const dep of pkg.dependencies ?? []) addDepNameToMap(dep);

  for (const type of typeOrder) {
    if (type === PrimaryDependency.NODE) {
      return PrimaryDependency.NODE;
    }

    const depName = DepNamesByPrimaryDependency[type];

    const matchingDepName = depNamesMap[depName];

    if (!matchingDepName) {
      continue;
    }

    return type;
  }

  return PrimaryDependency.NODE;
};
