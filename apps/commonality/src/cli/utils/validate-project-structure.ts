import { getInvalidPackages } from './../../../../../packages/data-packages/src/get-invalid-packages';
import { getRootPackageName } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';


export const validateProjectStructure = async ({
  directory,
  command,
}: {
  directory: string;
  command: Command;
}) => {
  const getRootDirectoryWithErrorHandling = async (cwd?: string) => {
    try {
      return await getRootDirectory(cwd);
    } catch {
      command.error(
        chalk.red.bold('No lockfile detected') +
          '\nYou must have a package-lock.json, yarn.lock, or pnpm-lock.yaml file at the root of your project',
        {
          exitCode: 1,
        },
      );
      return;
    }
  };

  const rootDirectory = await getRootDirectoryWithErrorHandling(directory);

  if (!rootDirectory) return;

  try {
    const packageJsonPath = path.join(rootDirectory, 'package.json');

    const exists = await fs.pathExists(packageJsonPath);

    if (!exists) {
      command.error(
        chalk.red.bold('No root package.json detected') +
          '\n You must have a package.json file within the same directory as your lockfile.',
        { exitCode: 1 },
      );
    }

    await getRootPackageName({ rootDirectory });
  } catch {
    command.error(
      chalk.red.bold('No "name" detected in root package.json') +
        '\nYour root package.json must have a valid "name" property.',
      { exitCode: 1 },
    );
  }

  try {
    const invalidPackages = await getInvalidPackages({ rootDirectory });

    for(const pkg of invalidPackages) {

      console.log(
        chalk.yellow.bold(`\n⚠ ${pkg.path}`) + `\n${pkg.reason}`

      )
    }
  } catch {
    return;
  }
};
