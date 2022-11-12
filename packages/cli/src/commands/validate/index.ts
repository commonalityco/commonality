import { getRootDirectory } from '../../core/getRootDirectory';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

import type { Config, PackageConfig } from '@commonalityco/types';
import { getPackages } from '../../core/getPackages';
import { getPackageManager } from '../../core/getPackageManager';
import { getWorkspaces } from '../../core/getWorkspaces';
import { getPackageDirectories } from '../../core/getPackageDirectories';
import { getConstraintViolations } from '../../core/getConstraintViolations';
import groupBy from 'lodash.groupby';

const program = new Command();

export const constraintValidateAction = async () => {
  const rootDirectory = await getRootDirectory();

  if (!rootDirectory) {
    console.log(chalk.yellow('Could not detect root directory'));
    return;
  }

  const configPath = path.resolve(rootDirectory, '.commonality', 'config.json');

  if (!fs.pathExistsSync(configPath)) {
    console.log(chalk.yellow('No config file found'));
    return;
  }

  const config: Config = await fs.readJSON(configPath);

  if (!config.constraints || !config.constraints?.length) {
    console.log(chalk.yellow('No constraints found'));
    return;
  }

  const packageManager = await getPackageManager(rootDirectory);
  const workspaces = await getWorkspaces(rootDirectory, packageManager);
  const packageDirectories = await getPackageDirectories(
    rootDirectory,
    workspaces
  );

  const packages = await getPackages({
    packageDirectories,
    rootDirectory,
  });

  const violations = getConstraintViolations(packages, config);

  if (violations.length === 0) {
    console.log(chalk.green('No violations found'));
  } else {
    for (const violation of violations) {
      // console.log(
      //   chalk.red(
      //     `Violation: ${violation.source} -> ${violation.target} at ${violation.path}`
      //   )
      // );

      console.log(chalk.underline(`${violation.source} → ${violation.target}`));
      console.log(chalk.dim(violation.path));

      console.log(
        `Expected: ${chalk.green(JSON.stringify(violation.constraint.allow))}`
      );
      console.log(`Found: ${chalk.red(JSON.stringify(violation.targetTags))}`);
      console.log('');
    }

    console.log(
      chalk.bold(chalk.bold.red(`Found ${violations.length} violations`))
    );
  }
};

export const validate = program
  .name('validate')
  .description('View the constraints applied to the tags within your monorepo')
  .action(constraintValidateAction);
