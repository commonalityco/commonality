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

const command = new Command();

const checksSpinner = ora('Running checks...');
const fixSpinner = ora('Fixing issues...');

class ConformLogger extends Logger {
  constructor() {
    super();
  }

  addCheckName({ result }: { result: ConformanceResult }) {
    let status;
    if (result.isValid) {
      status = c.green('✓ pass');
    } else if (result.level === 'error') {
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
      (result) => !result.isValid,
    );

    if (invalidResults.some((result) => result.level === 'error')) {
      failPackageCount++;
    }

    if (invalidResults.some((result) => result.level === 'warning')) {
      warnPackageCount++;
    }
  }

  const failCheckCount = results.filter(
    (result) => !result.isValid && result.level === 'error',
  ).length;
  const warnCheckCount = results.filter(
    (result) => !result.isValid && result.level === 'warning',
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
      (result) => !result.isValid && result.fix,
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

    const hasErrors = results.some(
      (result) => !result.isValid && result.level === 'error',
    );

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
  .description('Run conforming functions against your project')
  .option('--verbose', 'Show the result of all conformance checks')
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
