'use client';
import { useAtom } from 'jotai';
import {
  selectedDependenciesAtom,
  selectedPackagesAtom,
} from '../atoms/graph-atoms';
import {
  CodeownersData,
  ConstraintResult,
  Package,
  TagsData,
} from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { getConformanceScore } from '@commonalityco/utils-conformance/get-conformance-score';
import { PackageContext } from './package-context';
import { DependencyContext } from './dependency-context';
import { ProjectContext } from './project-context';
import { PackageManager, Status } from '@commonalityco/utils-core';

export function GraphContextSidebar({
  packages = [],
  tagsData = [],
  codeownersData = [],
  checkResults = [],
  constraintResults = [],
  packageManager,
  packageHeaderContent,
  projectName,
}: {
  packages: Package[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  checkResults: ConformanceResult[];
  constraintResults: ConstraintResult[];
  packageHeaderContent?: React.ReactNode;
  packageManager: PackageManager;
  projectName: string;
}) {
  const [selectedDependencies] = useAtom(selectedDependenciesAtom);
  const [selectedPackages] = useAtom(selectedPackagesAtom);

  if (selectedPackages.length === 1 && selectedPackages[0] !== undefined) {
    const selectedPackage = selectedPackages[0];

    return (
      <PackageContext
        pkg={selectedPackage}
        tagsData={tagsData}
        codeownersData={codeownersData}
        checkResults={checkResults}
        headerContent={packageHeaderContent}
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

  const score = getConformanceScore(checkResults);
  const checkPassCount = checkResults.filter(
    (result) => result.status === Status.Pass,
  ).length;
  const checkWarnCount = checkResults.filter(
    (result) => result.status === Status.Warn,
  ).length;
  const checkFailCount = checkResults.filter(
    (result) => result.status === Status.Fail,
  ).length;

  const constraintPassCount = constraintResults.filter(
    (result) => result.isValid,
  ).length;
  const constraintFailCount = constraintResults.filter(
    (result) => !result.isValid,
  ).length;

  return (
    <ProjectContext
      projectName={projectName}
      packageManager={packageManager}
      checkResults={checkResults}
      packageCount={packages.length}
      checkCount={checkResults.length}
      score={score}
      constraintPassCount={constraintPassCount}
      constraintFailCount={constraintFailCount}
      checkPassCount={checkPassCount}
      checkFailCount={checkFailCount}
      checkWarnCount={checkWarnCount}
    />
  );
}
