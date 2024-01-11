import { formatTagName } from '@commonalityco/utils-core';
/* eslint-disable unicorn/no-process-exit */
import type { ConformanceResult } from '@commonalityco/utils-conformance';
import { getConformanceResults } from '@commonalityco/utils-conformance/get-conformance-results';
import { runFixes } from '@commonalityco/utils-conformance/run-fixes';
import { getStatusForResults } from '@commonalityco/utils-conformance/get-status-for-results';
import { Command } from 'commander';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import path from 'node:path';
import { getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import ora from 'ora';
import c from 'chalk';
import prompts from 'prompts';
import process from 'node:process';
import { Logger } from '../utils/logger';
import { Status } from '@commonalityco/utils-core';
const command = new Command();
import { isCI } from 'std-env';
import uniqBy from 'lodash-es/uniqBy';

const checksSpinner = ora('Running checks...');

class ConformLogger extends Logger {
  constructor() {
    super();
  }

  addEmptyMessage() {
    const title = c.bold(`You don't have any checks configured.`);
    const body =
      'Create powerful conformance rules that run like tests and can be shared like lint rules.';
    const link = 'https://commonality.co/docs/checks';

    this.output += `\n${title}\n\n${body}\n\n${link}`;
  }

  addFilterTitle({
    filter,
    count,
    status,
  }: {
    filter: string;
    count: number;
    status: Status;
  }) {
    const countText = c.dim(`(${count})`);

    const textByStatus = {
      [Status.Pass]: c.green(`• Applied to: ${formatTagName(filter)}`),
      [Status.Warn]: c.yellow(`• Applied to: ${formatTagName(filter)}`),
      [Status.Fail]: c.red(`• Applied to: ${formatTagName(filter)}`),
    };

    const statusText = textByStatus[status];

    this.output += `\n${statusText} ${countText}`;
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

const createResultsMap = (results: ConformanceResult[]) => {
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

  return resultsMap;
};

const getPackageCounts = (resultsMap: Map<string, Set<ConformanceResult>>) => {
  let failPackageCount = 0;
  let warnPackageCount = 0;
  const totalPackageCount = resultsMap.size;

  for (const packageResults of resultsMap.values()) {
    const invalidResults = [...packageResults].filter(
      (result) => result.status !== Status.Pass,
    );

    if (invalidResults.some((result) => result.status === Status.Fail)) {
      failPackageCount++;
      continue;
    }

    if (invalidResults.some((result) => result.status === Status.Warn)) {
      warnPackageCount++;
      continue;
    }
  }

  return {
    totalPackageCount,
    passPackageCount: totalPackageCount - failPackageCount - warnPackageCount,
    failPackageCount,
    warnPackageCount,
  };
};

const getCheckCounts = (results: ConformanceResult[]) => {
  const failCheckCount = results.filter(
    (result) => result.status === Status.Fail,
  ).length;
  const warnCheckCount = results.filter(
    (result) => result.status === Status.Warn,
  ).length;
  const passCheckCount = results.filter(
    (result) => result.status === Status.Pass,
  ).length;

  return {
    totalCheckCount: results.length,
    passCheckCount,
    failCheckCount,
    warnCheckCount,
  };
};

const reportConformanceResults = ({
  logger,
  verbose,
  results,
}: {
  logger: ConformLogger;
  verbose: boolean;
  results: ConformanceResult[];
}) => {
  if (results.length === 0) {
    logger.addEmptyMessage();
    logger.write();
    return;
  }

  const resultsMap = createResultsMap(results);
  const packageCounts = getPackageCounts(resultsMap);
  const checkCounts = getCheckCounts(results);

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
      const statusForResults = getStatusForResults(resultsForFilter);

      const result = resultsForPackageByFilter.get(filter);

      if (!result) {
        continue;
      }

      if (statusForResults !== Status.Pass || verbose) {
        logger.addFilterTitle({
          filter,
          status: statusForResults,
          count: resultsForFilter.length,
        });
      }

      for (const result of resultsForPackage) {
        if (result.status !== Status.Pass || verbose) {
          logger.addCheckName({ result });

          if (result.message.filePath) {
            logger.addSubText(
              c.dim(path.join(result.package.path, result.message.filePath)),
            );
          }

          if (result.message.suggestion) {
            logger.addSubText(result.message.suggestion);
          }

          logger.addSubText();
        }
      }
    }
  }

  logger.addTotal({
    title: '\nPackages:',
    totalCount: packageCounts.totalPackageCount,
    passCount: packageCounts.passPackageCount,
    warnCount: packageCounts.warnPackageCount,
    failCount: packageCounts.failPackageCount,
  });

  logger.addTotal({
    title: '  Checks:',
    totalCount: checkCounts.totalCheckCount,
    passCount: checkCounts.passCheckCount,
    warnCount: checkCounts.warnCheckCount,
    failCount: checkCounts.failCheckCount,
  });

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
    const run = async () => {
      const results = await getResults();
      checksSpinner.stop();
      reportConformanceResults({ verbose, results, logger });

      const fixableResults = results.filter(
        (result) => result.status !== Status.Pass && result.fix,
      );

      if (fixableResults && fixableResults.length > 0 && !isCI) {
        console.log();
        const response = await prompts({
          type: 'confirm',
          name: 'shouldRunFixes',
          message: `Found ${fixableResults.length} auto-fixable checks. Run fixes?`,
          initial: false,
        });

        if (response.shouldRunFixes) {
          logger.clearScreen();
          await onFix(fixableResults);
          await run();
        }
      }

      const hasErrors = results.some((result) => result.status === Status.Fail);

      if (hasErrors) {
        process.exit(1);
      }
    };

    await run();
  } catch (error) {
    logger.writeError(error);
    process.exit(1);
  }
};

export const check = command
  .name('check')
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
          conformersByPattern: projectConfig?.config.checks ?? {},
          rootDirectory,
          packages,
          tagsData,
          codeownersData,
        });
      },
    });
  });
