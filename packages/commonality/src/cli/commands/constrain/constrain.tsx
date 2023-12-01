import React from 'react';
import { Command } from 'commander';
import { getConstraintResults } from '@commonalityco/data-violations';
import { ConstraintResult } from '@commonalityco/types';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import ora from 'ora';
import c from 'picocolors';
import { Logger } from '../../utils/logger.js';
import { DependencyType } from '@commonalityco/utils-core';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { getTagsData } from '@commonalityco/data-tags';
import { getDependencies, getPackages } from '@commonalityco/data-packages';

const constraintSpinner = ora('Validating constraints...');

export const ConstraintSpinner = () => (
  <Box gap={1}>
    <Text color="green">
      <Spinner type="dots" />
    </Text>
    <Text>Validating constraints...</Text>
  </Box>
);

const command = new Command();

class ConstrainLogger extends Logger {
  addConstraintTitle({ result }: { result: ConstraintResult }) {
    const statusText = result.isValid ? c.green('↳ pass') : c.red('↳ fail');
    const arrowText = result.isValid ? c.green('→') : c.red('→');

    const dependencyTextByType = {
      [DependencyType.PRODUCTION]: c.dim('prod'),
      [DependencyType.DEVELOPMENT]: c.dim('dev'),
      [DependencyType.PEER]: c.dim('peer'),
    };

    const dependencyText = result.dependencyPath
      .map((dep) => {
        const typeText = c.dim(dependencyTextByType[dep.type]);

        return `${dep.target} ${typeText}`;
      })
      .join(` ${arrowText} `);

    this.output += `\n${statusText} ${dependencyText}`;
  }

  addConstraintTable({ result }: { result: ConstraintResult }) {
    const extraPad = 'disallow' in result.constraint ? '   ' : '';
    const foundExtraPad = 'disallow' in result.constraint ? '     ' : '  ';

    this.addSubText(
      `Matches:${extraPad} ${
        result.filter === '*' ? 'All packages' : `#${result.filter}`
      }`,
    );

    if ('allow' in result.constraint) {
      const allowTagsText =
        typeof result.constraint.allow === 'string' &&
        result.constraint.allow === '*'
          ? c.green(result.constraint.allow)
          : result.constraint.allow
              .map((tag) => `#${tag}`)
              .map((tag) =>
                result.foundTags?.map((tag) => `#${tag}`).includes(tag)
                  ? c.green(tag)
                  : tag,
              )
              .join(', ');

      this.addSubText(`Allowed:${extraPad} ${allowTagsText}`);
    }

    if ('disallow' in result.constraint) {
      const disallowTagsText =
        typeof result.constraint.disallow === 'string' &&
        result.constraint.disallow === '*'
          ? c.red(result.constraint.disallow)
          : result.constraint.disallow
              .map((tag) => `#${tag}`)
              .map((tag) =>
                result.foundTags?.map((tag) => `#${tag}`).includes(tag)
                  ? c.red(tag)
                  : tag,
              )
              .join(', ');

      this.addSubText(`Disallowed: ${disallowTagsText}`);
    }

    if (result.foundTags) {
      const foundTagsText = result.foundTags
        .map((tag) => `#${tag}`)
        .map((tag) => {
          if (
            'disallow' in result.constraint &&
            typeof result.constraint.disallow === 'string' &&
            result.constraint.disallow === '*'
          ) {
            return c.red(tag);
          }

          if (
            'allow' in result.constraint &&
            typeof result.constraint.allow === 'string' &&
            result.constraint.allow === '*'
          ) {
            return c.green(tag);
          }

          if (
            'disallow' in result.constraint &&
            result.constraint.disallow?.map((tag) => `#${tag}`).includes(tag)
          ) {
            return c.red(tag);
          }

          if (
            'allow' in result.constraint &&
            result.constraint.allow?.map((tag) => `#${tag}`).includes(tag)
          ) {
            return c.green(tag);
          }

          return tag;
        })
        .join(', ');

      this.addSubText(`Found:${foundExtraPad} ${foundTagsText}`);
    } else {
      this.addSubText(`Found:${foundExtraPad} No tags found`);
    }

    this.addSubText();
  }
}

const reportConstraints = async ({
  logger,
  results,
  verbose,
}: {
  logger: ConstrainLogger;
  results: ConstraintResult[];
  verbose: boolean;
}) => {
  // This is keyed by packageName
  const resultsMap = new Map<string, Set<ConstraintResult>>();

  for (const result of results) {
    const packageName = result.dependencyPath[0].source;
    const existingResultsForPackage = resultsMap.get(packageName);

    if (existingResultsForPackage) {
      existingResultsForPackage.add(result);
    } else {
      resultsMap.set(packageName, new Set<ConstraintResult>([result]));
    }
  }

  let failPackageCount = 0;

  for (const packageResults of resultsMap.values()) {
    const invalidResults = [...packageResults].filter(
      (result) => !result.isValid,
    );

    if (invalidResults.some((result) => !result.isValid)) {
      failPackageCount++;
    }
  }

  const failConstraintCount = results.filter(
    (result) => !result.isValid,
  ).length;

  for (const packageName of resultsMap.keys()) {
    const resultsForPackage = resultsMap.get(packageName);

    if (!resultsForPackage) {
      continue;
    }

    const hasInvalidResults = [...resultsForPackage].some(
      (result) => !result.isValid,
    );

    logger.addPackageName({
      verbose,
      status: hasInvalidResults ? 'fail' : 'pass',
      packageName,
      count: resultsForPackage.size,
    });

    for (const result of resultsForPackage) {
      if (!result.isValid || verbose) {
        logger.addConstraintTitle({ result });
        logger.addConstraintTable({ result });
      }
    }
  }

  logger.addTotal({
    title: '\nPackages:   ',
    totalCount: resultsMap.size,
    passCount: resultsMap.size - failPackageCount,
    failCount: failPackageCount,
  });

  logger.addTotal({
    title: 'Constraints:',
    totalCount: results.length,
    failCount: failConstraintCount,
    passCount: results.length - failConstraintCount,
  });

  logger.write();
};

export const constrain = command
  .name('constrain')
  .description('Validate that local dependencies adhere to your constraints')
  .option('--verbose', 'Show the result of all conformance checks')
  .action(async (options: { verbose: boolean }) => {
    const logger = new ConstrainLogger();

    constraintSpinner.start();

    const rootDirectory = await getRootDirectory();

    const _projectConfig = getProjectConfig({ rootDirectory });
    const _dependencies = getDependencies({ rootDirectory });

    const packages = await getPackages({ rootDirectory });

    const _tagsData = getTagsData({ rootDirectory, packages });

    const projectConfig = await _projectConfig;
    const dependencies = await _dependencies;
    const tagsData = await _tagsData;

    const results = await getConstraintResults({
      dependencies,
      constraints: projectConfig?.config.constraints,
      tagsData,
    });

    constraintSpinner.stop();

    await reportConstraints({ results, verbose: options.verbose, logger });
  });
