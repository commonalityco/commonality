import { getRootPackageName, getPackages } from '@commonalityco/data-packages';
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
        '\n Your root package.json must have a valid "name" property.',
      { exitCode: 1 },
    );
  }

  try {
    await getPackages({ rootDirectory });
  } catch (error) {
    console.log(error);
  }
};
