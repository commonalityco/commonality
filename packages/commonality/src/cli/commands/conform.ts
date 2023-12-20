import { formatTagName } from '@commonalityco/utils-core';
/* eslint-disable unicorn/no-process-exit */
import {
  getConformanceResults,
  runFixes,
  getStatusForResults,
  ConformanceResult,
} from '@commonalityco/feature-conformance/utilities';
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

const checksSpinner = ora('Running checks...');

class ConformLogger extends Logger {
  constructor() {
    super();
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

const reportConformanceResults = ({
  logger,
  verbose,
  results,
}: {
  logger: ConformLogger;
  verbose: boolean;
  results: ConformanceResult[];
}) => {
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
      (result) => result.status !== Status.Pass,
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

      if (fixableResults && fixableResults.length > 0) {
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

export const conform = command
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
