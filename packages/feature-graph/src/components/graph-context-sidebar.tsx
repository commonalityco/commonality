'use client';
import { useAtom } from 'jotai';
import {
  selectedDependenciesAtom,
  selectedPackagesAtom,
} from '../atoms/graph-atoms';
import {
  CodeownersData,
  ConstraintResult,
  TagsData,
} from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { PackageContext } from './package-context';
import { DependencyContext } from './dependency-context';
import { ProjectContext } from './project-context';

export function GraphContextSidebar({
  tagsData = [],
  codeownersData = [],
  checkResults = [],
  constraintResults = [],
}: {
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  checkResults: ConformanceResult[];
  constraintResults: ConstraintResult[];
}) {
  const [selectedDependencies, setSelectedDependencies] = useAtom(
    selectedDependenciesAtom,
  );
  const [selectedPackages] = useAtom(selectedPackagesAtom);

  if (selectedPackages.length === 1 && selectedPackages[0] !== undefined) {
    const selectedPackage = selectedPackages[0];

    return (
      <PackageContext
        pkg={selectedPackage}
        tagsData={tagsData}
        codeownersData={codeownersData}
        checkResults={checkResults}
      />
    );
  }

  if (
    selectedDependencies.length === 1 &&
    selectedDependencies[0] !== undefined
  ) {
    const selectedDependency = selectedDependencies[0];

    return (
      <DependencyContext
        dependency={selectedDependency}
        constraintResults={constraintResults}
      />
    );
  }

  return <ProjectContext />;
}
