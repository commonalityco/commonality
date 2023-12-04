/* eslint-disable unicorn/no-process-exit */
import { runFixes } from '@commonalityco/feature-conformance';
import { getConformanceResults } from '@commonalityco/feature-conformance';
import { Command } from 'commander';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { ConformanceResult } from '@commonalityco/types';
import path from 'node:path';
import { getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import ora from 'ora';
import c from 'picocolors';
import prompts from 'prompts';
import process from 'node:process';
import { Logger } from '../utils/logger';
import { Status } from '@commonalityco/utils-core';

const command = new Command();

const checksSpinner = ora('Running checks...');
const fixSpinner = ora('Fixing issues...');

class ConformLogger extends Logger {
  constructor() {
    super();
  }

  addFilterTitle({
    filter,
    count,
    isValid,
  }: {
    filter: string;
    count: number;
    isValid: boolean;
  }) {
    const countText = c.dim(`(${count})`);
    const statusText = isValid ? c.green(`# ${filter}`) : c.red(`# ${filter}`);

    if (statusText === '*') {
      const statusText = isValid
        ? c.green(`# All packages`)
        : c.red(`# All packages`);

      this.output += `\n${statusText} ${countText}`;
    } else {
      const statusText = isValid
        ? c.green(`# ${filter}`)
        : c.red(`# ${filter}`);

      this.output += `\n${statusText} ${countText}`;
    }
  }

  addCheckName({ result }: { result: ConformanceResult }) {
    let status;
    if (result.status === Status.Pass) {
      status = c.green('✓ pass');
    } else if (result.status === Status.Fail) {
      status = c.red('✘ fail');
    } else {
      status = c.yellow('⚠ warn');
    }

    const title = result.message.title;
    1;
    this.output += `\n${status} ${title}`;
  }
}

const reportConformanceResults = ({
  logger,
  verbose,
  results,
}: {
  logger: ConformLogger;
  verbose: boolean;
  results: ConformanceResult[];
}) => {
  checksSpinner.start();

  // This is keyed by packageName
  const resultsMap = new Map<string, Set<ConformanceResult>>();

  for (const result of results) {
    const packageName = result.package.name;
    const existingResultsForPackage = resultsMap.get(packageName);

    if (existingResultsForPackage) {
      existingResultsForPackage.add(result);
    } else {
      resultsMap.set(packageName, new Set<ConformanceResult>([result]));
    }
  }

  let failPackageCount = 0;
  let warnPackageCount = 0;

  for (const packageResults of resultsMap.values()) {
    const invalidResults = [...packageResults].filter(
      (result) => result.status === Status.Fail,
    );

    if (invalidResults.some((result) => result.status === Status.Fail)) {
      failPackageCount++;
    }

    if (invalidResults.some((result) => result.status === Status.Warn)) {
      warnPackageCount++;
    }
  }

  const failCheckCount = results.filter(
    (result) => result.status === Status.Fail,
  ).length;
  const warnCheckCount = results.filter(
    (result) => result.status === Status.Warn,
  ).length;

  for (const packageName of resultsMap.keys()) {
    const resultsForPackage = resultsMap.get(packageName);

    if (!resultsForPackage) {
      continue;
    }

    const hasInvalidResults = [...resultsForPackage].some(
      (result) => result.status !== Status.Pass,
    );

    logger.addPackageName({
      verbose,
      status: hasInvalidResults ? 'fail' : 'pass',
      packageName,
      count: resultsForPackage.size,
    });

    const resultsForPackageByFilter = new Map<string, ConformanceResult[]>();
    for (const result of resultsForPackage) {
      const filter = result.filter;
      const existingResultsForFilter = resultsForPackageByFilter.get(filter);

      if (existingResultsForFilter) {
        existingResultsForFilter.push(result);
      } else {
        resultsForPackageByFilter.set(filter, [result]);
      }
    }

    for (const [filter, resultsForFilter] of resultsForPackageByFilter) {
      const hasInvalidFilterResults = resultsForFilter.some(
        (result) => result.status !== Status.Pass,
      );

      const result = resultsForPackageByFilter.get(filter);

      if (!result) {
        continue;
      }

      if (hasInvalidFilterResults || verbose) {
        logger.addFilterTitle({
          filter,
          isValid: !hasInvalidFilterResults,
          count: resultsForFilter.length,
        });
      }

      for (const result of resultsForPackage) {
        if (result.status !== Status.Pass || verbose) {
          logger.addCheckName({ result });

          if (result.message.filepath) {
            logger.addSubText(
              path.join(result.package.path, result.message.filepath),
            );
          }
          if (result.message.context) {
            logger.addSubText(result.message.context);
          }
        }
      }
    }
  }

  logger.addTotal({
    title: '\nPackages:',
    totalCount: resultsMap.size,
    passCount: resultsMap.size - failPackageCount - warnCheckCount,
    warnCount: warnPackageCount,
    failCount: failPackageCount,
  });

  logger.addTotal({
    title: '  Checks:',
    totalCount: resultsMap.size,
    passCount: resultsMap.size - failCheckCount - warnCheckCount,
    warnCount: warnCheckCount,
    failCount: failCheckCount,
  });
  checksSpinner.stop();
  logger.write();
};

export const action = async ({
  verbose,
  getResults,
  onFix = () => Promise.resolve(),
}: {
  verbose: boolean;
  getResults: () => Promise<ConformanceResult[]>;
  onFix: (results: ConformanceResult[]) => Promise<void>;
}) => {
  const logger = new ConformLogger();

  try {
    let results = await getResults();

    reportConformanceResults({ verbose, results, logger });

    const fixableResults = results.filter(
      (result) => result.status !== Status.Pass && result.fix,
    );

    while (fixableResults.length > 0) {
      const response = await prompts({
        type: 'confirm',
        name: 'shouldRunFixes',
        message: `Found ${fixableResults} fixable issues, run fixes?`,
        initial: false,
      });

      if (!response.shouldRunFixes) {
        break;
      }

      logger.clearScreen();

      fixSpinner.start();

      await onFix(fixableResults);

      fixSpinner.stop();

      results = await getResults();

      reportConformanceResults({ verbose, results, logger });
    }

    const hasErrors = results.some((result) => result.status === Status.Fail);

    if (hasErrors) {
      global.process.exit(1);
    }
  } catch (error) {
    logger.writeError(error);
    process.exit(1);
  }
};

export const conform = command
  .name('conform')
  .description('Validate that packages pass conformance checks')
  .option('--verbose', 'Show the result of all checks')
  .action(async ({ verbose }: { verbose: boolean }) => {
    checksSpinner.start();

    const rootDirectory = await getRootDirectory();
    const projectConfig = await getProjectConfig({ rootDirectory });
    const packages = await getPackages({ rootDirectory });
    const tagsData = await getTagsData({ rootDirectory, packages });
    const codeownersData = await getCodeownersData({ rootDirectory, packages });

    return action({
      verbose,
      onFix: (results) => {
        return runFixes({
          conformanceResults: results,
          allPackages: packages,
          rootDirectory,
          tagsData,
          codeownersData,
        });
      },
      getResults: () => {
        return getConformanceResults({
          conformersByPattern: projectConfig?.config.conformers ?? {},
          rootDirectory,
          packages,
          tagsData,
          codeownersData,
        });
      },
    });
  });
