import React from 'react';
import { Command } from 'commander';
import { getViolations } from '@commonalityco/data-violations';
import {
  Constraint,
  Dependency,
  Package,
  ProjectConfig,
  TagsData,
  Violation,
} from '@commonalityco/types';
import { Box, render, Text, useApp } from 'ink';
import { useAsyncFn } from '../../utils/use-async-fn.js';
import Spinner from 'ink-spinner';
import { useMemo } from 'react';
import { CheckTagsData } from '../../components/check-tags-data.js';
import { CheckDependencies } from '../../components/check-dependencies.js';
import { CheckConstraints } from '../../components/check-constraints.js';
import { TotalMessage } from '../../components/total-message.js';
import { CheckPackages } from '../../components/check-packages.js';
import { MessagePackageTitle } from '../../components/message-package-title.js';
import { DependencyMessage } from './dependency-message.js';
import { formatTagName } from '@commonalityco/utils-core';

export const ConstraintSpinner = () => (
  <Box gap={1}>
    <Text color="green">
      <Spinner type="dots" />
    </Text>
    <Text>Validating constraints...</Text>
  </Box>
);

const command = new Command();

function DependencyList({
  dependencies,
  violations,
  packages,
  constraint,
  verbose,
  filter,
}: {
  dependencies: Dependency[];
  packages: Package[];
  violations: Violation[];
  constraint: Constraint;
  verbose: boolean;
  filter: string;
}) {
  return dependencies.map((dependency) => {
    const violationForDependency = violations.find(
      (violation) =>
        violation.targetPackageName === dependency.target &&
        violation.sourcePackageName === dependency.source,
    );
    const targetPackage = packages.find(
      (pkg) => pkg.name === dependency.target,
    );

    if (!violationForDependency && !verbose) {
      return;
    }

    if (!targetPackage) {
      return;
    }

    return (
      <DependencyMessage
        constraint={constraint}
        targetPkg={targetPackage}
        filter={filter}
        violation={violationForDependency}
        key={`${dependency.type}-${dependency.source}-${dependency.target}-${dependency.version}`}
        type={dependency.type}
        isValid={!violationForDependency}
      />
    );
  });
}

function ConstraintList({
  dependencies,
  constraints,
  violations,
  verbose,
  packages,
}: {
  packages: Package[];
  dependencies: Dependency[];
  violations: Violation[];
  constraints: Array<[string, Constraint]>;
  verbose: boolean;
}) {
  if (dependencies.length === 0 && verbose) {
    return (
      <Box
        paddingLeft={2}
        paddingBottom={1}
        borderDimColor
        borderTop={false}
        borderRight={false}
        borderBottom={false}
        borderStyle="single"
        flexDirection="column"
      >
        <Text dimColor>No internal dependencies</Text>
      </Box>
    );
  }

  if (constraints.length === 0 && verbose) {
    return (
      <Box
        paddingLeft={2}
        paddingBottom={1}
        borderDimColor
        borderTop={false}
        borderRight={false}
        borderBottom={false}
        borderStyle="single"
        flexDirection="column"
      >
        <Text dimColor>No constraints for internal dependencies</Text>
      </Box>
    );
  }

  const sortedConstraints = constraints.sort((a, b) => (a < b ? -1 : 0));

  return sortedConstraints.map(([key, constraint]) => {
    return (
      <Box key={key} flexDirection="column">
        <Box flexDirection="column">
          <DependencyList
            filter={key}
            constraint={constraint}
            packages={packages}
            violations={violations}
            dependencies={dependencies}
            verbose={verbose}
          />
        </Box>
      </Box>
    );
  });
}

export function ConstraintValidator({
  constraints = {},
  tagsData = [],
  dependencies = [],
  packages = [],
  verbose,
}: {
  constraints: ProjectConfig['constraints'];
  packages: Package[];
  tagsData: TagsData[];
  dependencies: Dependency[];
  verbose: boolean;
}) {
  const { exit } = useApp();
  const { data, isLoading, error } = useAsyncFn(async () => {
    return await getViolations({
      dependencies,
      constraints,
      tagsData,
    });
  });

  const violations = data ?? [];

  const violationsByPackageName = useMemo(() => {
    if (!violations) {
      return {};
    }

    const acc: Record<string, Violation[]> = {};
    for (const violation of violations) {
      if (!acc[violation.sourcePackageName]) {
        acc[violation.sourcePackageName] = [];
      }
      acc[violation.sourcePackageName].push(violation);
    }
    return acc;
  }, [violations]);

  const constraintsByPackage: Record<
    string,
    ProjectConfig['constraints'] | Record<string, never>
  > = useMemo(() => {
    const acc:
      | Record<string, ProjectConfig['constraints']>
      | Record<string, never> = {};
    const tagsDataByPackageName = new Map(
      tagsData.map((data) => [data.packageName, data.tags]),
    );

    for (const filter of Object.keys(constraints)) {
      for (const [packageName, tags] of tagsDataByPackageName.entries()) {
        if (tags.includes(filter)) {
          if (!acc[packageName]) {
            acc[packageName] = {};
          }

          acc[packageName]![filter] = constraints[filter];
        }
      }
    }
    return acc;
  }, [constraints, tagsData]);

  const constraintsWithViolationCount = Object.keys(constraints).filter(
    (filter) => violations.some((violation) => violation.appliedTo === filter),
  ).length;

  const packageNames = Object.keys(violationsByPackageName);

  if (error) {
    exit(error);
    return;
  }

  if (isLoading) {
    return <ConstraintSpinner />;
  }

  return (
    <Box flexDirection="column">
      <Box flexDirection="column">
        {packages.map((pkg) => {
          const violationsForPackage = violations.filter(
            (violation) => violation.sourcePackageName === pkg.name,
          );
          const constraintsForPackage: ProjectConfig['constraints'] =
            constraintsByPackage[pkg.name] ?? {};
          const shownConstraints: Array<[string, Constraint]> = Object.keys(
            constraintsForPackage,
          )
            .filter((filter) => {
              if (verbose) {
                return true;
              }

              const matchingViolations = violationsForPackage.filter(
                (violation) => violation.appliedTo === filter,
              );

              return matchingViolations.length;
            })
            .map((filter) => [filter, constraints[filter]]);

          const dependenciesForPackage = dependencies
            .filter((dep) => dep.source === pkg.name)
            .sort((a, b) => a.target.localeCompare(b.target));

          const result = violationsForPackage.length > 0 ? 'fail' : 'pass';

          const itemCount =
            Object.keys(constraintsForPackage).length *
            dependenciesForPackage.length;

          return (
            <Box key={pkg.name} flexDirection="column">
              <MessagePackageTitle
                result={result}
                pkg={pkg}
                countMessage={`(${itemCount})`}
                verbose={verbose && itemCount > 0}
              />
              <ConstraintList
                verbose={verbose}
                violations={violations}
                constraints={shownConstraints}
                dependencies={dependenciesForPackage}
                packages={packages}
              />
            </Box>
          );
        })}
      </Box>
      <Box flexDirection="column" marginTop={1}>
        <TotalMessage
          title="Packages:   "
          totalCount={packages.length}
          passCount={packages.length - packageNames.length}
          failCount={packageNames.length}
        />
        <TotalMessage
          title="Constraints:"
          totalCount={Object.keys(constraints).length}
          passCount={
            Object.keys(constraints).length - constraintsWithViolationCount
          }
          failCount={constraintsWithViolationCount}
        />
      </Box>
    </Box>
  );
}

function ConstraintCommandHandler({ verbose }: { verbose: boolean }) {
  return (
    <CheckConstraints loadingMessage={<ConstraintSpinner />}>
      {({ constraints }) => (
        <CheckTagsData loadingMessage={<ConstraintSpinner />}>
          {({ tagsData }) => (
            <CheckDependencies loadingMessage={<ConstraintSpinner />}>
              {({ dependencies }) => (
                <CheckPackages>
                  {({ packages }) => (
                    <ConstraintValidator
                      constraints={constraints}
                      tagsData={tagsData}
                      packages={packages}
                      dependencies={dependencies}
                      verbose={verbose}
                    />
                  )}
                </CheckPackages>
              )}
            </CheckDependencies>
          )}
        </CheckTagsData>
      )}
    </CheckConstraints>
  );
}

export const constrain = command
  .name('constrain')
  .description('Validate that local dependencies adhere to your constraints')
  .option('--verbose', 'Show the result of all conformance checks')
  .action(async (options: { verbose: boolean }) => {
    render(<ConstraintCommandHandler verbose={options.verbose} />);
  });
