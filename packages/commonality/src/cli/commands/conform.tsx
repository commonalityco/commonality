/* eslint-disable unicorn/no-process-exit */
import React, { Fragment } from 'react';
import { runFixes } from '@commonalityco/utils-conformance';
import { getConformanceResults } from '@commonalityco/data-conformance';
import { Command } from 'commander';
import { getRootDirectory } from '@commonalityco/data-project';
import {
  CodeownersData,
  ConformanceResult,
  Conformer,
  TagsData,
  Workspace,
} from '@commonalityco/types';
import { Box, render, Text, useApp, useInput } from 'ink';
import { useState } from 'react';
import Spinner from 'ink-spinner';
import { useAsyncFn } from '../utils/use-async-fn.js';
import { CheckTagsData } from '../components/check-tags-data.js';
import { TotalMessage } from '../components/total-message.js';
import { CheckConformers } from '../components/check-conformers.js';
import { CheckWorkspaces } from '../components/check-workspaces.js';
import path from 'node:path';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import { getPackages } from '@commonalityco/data-packages';
import { CheckCodeownersData } from '../components/check-codeowners-data.js';

const command = new Command();

export const PackageTitleMessage = ({
  verbose,
  result,
  packageName,
  checkCount,
}: {
  verbose: boolean;
  result: 'pass' | 'fail';
  packageName: string;
  checkCount: number;
}) => {
  return (
    <Box gap={1}>
      {result === 'fail' || verbose ? (
        <Text color="yellow">❯</Text>
      ) : (
        <Text color="green">✓</Text>
      )}
      <Text dimColor={result === 'pass' && !verbose}>{packageName}</Text>
      <Text dimColor>{`(${checkCount})`}</Text>
    </Box>
  );
};

export const AutoFixMessage = ({
  autoFixCount,
  onAccept = () => {},
}: {
  autoFixCount: number;
  onAccept: () => void;
}) => {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input.toLocaleLowerCase() === 'y' || key.return) {
      onAccept();
    } else {
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Text>{`Found ${autoFixCount} fixable issues, run fix functions?`}</Text>
      <Box gap={1}>
        <Text dimColor>press</Text>
        <Text>y</Text>
        <Text dimColor>or</Text>
        <Text>enter</Text>
        <Text dimColor>to run conformers</Text>
      </Box>
      <Box gap={1}>
        <Text dimColor>press</Text>
        <Text>n</Text>
        <Text dimColor>or</Text>
        <Text>esc</Text>
        <Text dimColor>to exit</Text>
      </Box>
    </Box>
  );
};

export const CheckSpinner = () => (
  <Box gap={1}>
    <Text color="green">
      <Spinner type="dots" />
    </Text>
    <Text>Running checks...</Text>
  </Box>
);

export const ConformRunner = ({
  verbose,
  conformersByPattern,
  rootDirectory,
  workspaces,
  rootWorkspace,
  tagsData,
  codeownersData,
  onError = () => {},
}: {
  verbose: boolean;
  conformersByPattern: Record<string, Conformer[]>;
  rootDirectory: string;
  workspaces: Workspace[];
  rootWorkspace: Workspace;
  tagsData: TagsData[];
  onError?: (error: Error) => void;
  codeownersData: CodeownersData[];
}) => {
  const [autoFixRunCount, setAutoFixRunCount] = useState(0);
  const { data, refetch, isLoading, error } = useAsyncFn(async () => {
    return await getConformanceResults({
      conformersByPattern,
      rootWorkspace,
      rootDirectory,
      workspaces,
      tagsData,
      codeownersData,
    });
  });

  const results = data ?? [];

  const resultsByPackageName: Record<string, ConformanceResult[]> = {};
  for (const result of results) {
    const packageName = result.workspace.packageJson.name as string;
    if (!resultsByPackageName[packageName]) {
      resultsByPackageName[packageName] = [];
    }
    resultsByPackageName[packageName].push(result);
  }

  const packageNames = Object.keys(resultsByPackageName).sort();

  const getFailPackageCount = () => {
    let failPackageCount = 0;
    for (const packageName of packageNames) {
      const packageResults = resultsByPackageName[packageName];
      if (packageResults.some((result) => !result.isValid)) {
        failPackageCount++;
      }
    }
    return failPackageCount;
  };
  const failPackageCount = getFailPackageCount();

  const failCheckCount = results.filter((result) => !result.isValid).length;

  const autoFixCount = results.filter(
    (result) => !result.isValid && result.fix,
  ).length;

  if (error) {
    onError(error);
    return;
  }

  if (isLoading) {
    return <CheckSpinner />;
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Box marginTop={1} flexDirection="column">
          {packageNames.map((packageName, index) => {
            const conformanceResults = resultsByPackageName[packageName];
            const hasInvalidResults = conformanceResults.some(
              (result) => !result.isValid,
            );

            return (
              <Box key={index} flexDirection="column">
                <PackageTitleMessage
                  verbose={verbose}
                  result={hasInvalidResults ? 'fail' : 'pass'}
                  packageName={packageName}
                  checkCount={conformanceResults.length}
                />
                <Box flexDirection="column" paddingLeft={2}>
                  {conformanceResults.map((conformanceResult, index) => {
                    return !conformanceResult.isValid || verbose ? (
                      <Fragment key={index}>
                        <Box flexDirection="row" gap={1} flexShrink={0}>
                          <Text
                            color={conformanceResult.isValid ? 'green' : 'red'}
                          >
                            {conformanceResult.isValid ? '✓' : '✘'}{' '}
                            {conformanceResult.isValid ? 'pass' : 'fail'}
                          </Text>
                          <Text>{conformanceResult.message.title}</Text>
                        </Box>
                        {conformanceResult.message.filepath ? (
                          <Box
                            paddingRight={1}
                            paddingLeft={6}
                            borderDimColor
                            borderTop={false}
                            borderRight={false}
                            borderBottom={false}
                            borderStyle="single"
                          >
                            <Text dimColor>
                              {path.join(
                                conformanceResult.workspace.path,
                                conformanceResult.message.filepath,
                              )}
                            </Text>
                          </Box>
                        ) : undefined}
                        {conformanceResult.message.context ? (
                          <Box
                            paddingRight={1}
                            paddingLeft={6}
                            borderDimColor
                            borderTop={false}
                            borderRight={false}
                            borderBottom={false}
                            borderStyle="single"
                          >
                            <Text>{conformanceResult.message.context}</Text>
                          </Box>
                        ) : undefined}
                      </Fragment>
                    ) : undefined;
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      {isLoading ? undefined : (
        <Box flexDirection="column" marginTop={1}>
          <Box>
            <TotalMessage
              title="Packages:"
              totalCount={packageNames.length}
              passCount={packageNames.length - failPackageCount}
              failCount={failPackageCount}
            />
          </Box>
          <Box>
            <TotalMessage
              title="  Checks:"
              totalCount={results.length}
              passCount={results.length - failCheckCount}
              failCount={failCheckCount}
            />
          </Box>
        </Box>
      )}
      {autoFixCount > 0 && failPackageCount > 0 && !isLoading ? (
        <Box paddingTop={1}>
          <AutoFixMessage
            autoFixCount={autoFixCount}
            onAccept={async () => {
              await runFixes({
                rootWorkspace,
                rootDirectory,
                workspaces,
                conformanceResults: results,
                codeownersData,
                tagsData,
              });

              setTimeout(async () => {
                await refetch();
                setAutoFixRunCount(autoFixCount + 1);
              }, 0);
            }}
          />
        </Box>
      ) : undefined}
      {failPackageCount === 0 && autoFixRunCount > 0 ? (
        <Text color="green">Successfully fixed issues</Text>
      ) : undefined}
    </Box>
  );
};

export const ConformCommand = ({
  verbose = false,
  rootDirectory,
}: {
  verbose: boolean;
  rootDirectory: string;
}) => {
  return (
    <Box flexDirection="column">
      <CheckConformers loadingMessage={<CheckSpinner />}>
        {({ conformers }) => {
          return (
            <CheckWorkspaces loadingMessage={<CheckSpinner />}>
              {({ workspaces, rootWorkspace }) => (
                <CheckTagsData loadingMessage={<CheckSpinner />}>
                  {({ tagsData }) => (
                    <CheckCodeownersData loadingMessage={<CheckSpinner />}>
                      {({ codeownersData }) => (
                        <ConformRunner
                          rootWorkspace={rootWorkspace}
                          verbose={verbose}
                          codeownersData={codeownersData}
                          conformersByPattern={conformers}
                          rootDirectory={rootDirectory}
                          workspaces={workspaces}
                          tagsData={tagsData}
                          onError={(error) => {
                            console.log(error);
                            process.exit(1);
                          }}
                        />
                      )}
                    </CheckCodeownersData>
                  )}
                </CheckTagsData>
              )}
            </CheckWorkspaces>
          );
        }}
      </CheckConformers>
    </Box>
  );
};

export const conform = command
  .name('conform')
  .description('Run conforming functions against your project')
  .option('--verbose', 'Show the result of all conformance checks')
  .action(async (options: { verbose: boolean }) => {
    const rootDirectory = await getRootDirectory();

    render(
      <ConformCommand
        verbose={options.verbose}
        rootDirectory={rootDirectory}
      />,
    );
  });
