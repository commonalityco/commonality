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
import console from 'node:console';

const command = new Command();

const checksSpinner = ora('Running checks...');
const fixSpinner = ora('Fixing issues...');

const createLogger = () => {
  let output = '';

  return {
    addTotal: ({
      totalCount,
      passCount,
      warnCount,
      failCount,
      title,
    }: {
      totalCount: number;
      passCount: number;
      warnCount: number;
      failCount: number;
      title: string;
    }) => {
      const failText =
        failCount > 0 ? c.red(`${failCount} failed`) : c.dim('0 failed');
      const passText =
        passCount > 0 ? c.green(`${passCount} passed`) : c.dim('0 passed');
      const warnText =
        warnCount > 0 ? c.yellow(`${warnCount} warnings`) : c.dim('0 warnings');
      const totalText = c.dim(`(${totalCount})`);

      output += `\n${title} ${failText} ${warnText} ${passText} ${totalText}`;
    },
    addCheckName: ({ result }: { result: ConformanceResult }) => {
      let status;
      if (result.isValid) {
        status = c.green('✓ pass');
      } else if (result.level === 'error') {
        status = c.red('✘ fail');
      } else {
        status = c.yellow('⚠ warn');
      }

      const title = result.message.title;

      output += `\n${status} ${title}`;
    },
    addFilepath: ({ result }: { result: ConformanceResult }) => {
      if (!result.message.filepath) {
        return;
      }

      const filepath = path.join(result.package.path, result.message.filepath);

      output += c.dim(`\n│      ${filepath}`);
    },
    addContext: ({ result }: { result: ConformanceResult }) => {
      output += c.dim(`\n│      ${result.message.context}`);
    },
    addPackageName: ({
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
      const icon = result === 'fail' || verbose ? c.yellow('❯') : c.green('✓');
      const name =
        result === 'pass' && !verbose ? c.dim(packageName) : packageName;
      const count = c.dim(`(${checkCount})`);

      output += `\n${icon} ${name} ${count}`;
    },

    write: () => {
      console.log(output);
      output = '';
    },
    writeError: (error: unknown) => {
      if (error instanceof Error) {
        const status = c.bold(c.inverse(c.red(' Error: ')));
        const title = c.red(error.message);
        const stack = error.stack;

        console.log(`\n${status} ${title}\n${stack}`);
      }

      console.error(error);
    },
    clearScreen: () => {
      const ESC = '\u001B[';
      const ERASE_DOWN = `${ESC}J`;
      const CURSOR_TO_START = `${ESC}1;1H`;

      console.log(`${CURSOR_TO_START}${ERASE_DOWN}`);
    },
  };
};

const reportConformanceResults = ({
  logger,
  verbose,
  results,
}: {
  logger: ReturnType<typeof createLogger>;
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
      result: hasInvalidResults ? 'fail' : 'pass',
      packageName,
      checkCount: resultsForPackage.size,
    });

    for (const result of resultsForPackage) {
      if (!result.isValid || verbose) {
        logger.addCheckName({ result });

        if (result.message.filepath) {
          logger.addFilepath({ result });
        }
        if (result.message.context) {
          logger.addContext({ result });
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
  const logger = createLogger();
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
