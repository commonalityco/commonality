import { getRootPackageName, getPackages } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import { Command } from 'commander';

export const validateProjectStructure = async ({
  directory,
  command,
}: {
  directory: string;
  command: Command;
}) => {
  const getRootDirectoryWithErrorHandling = async (cwd?: string) => {
    try {
      const rootDir = await getRootDirectory(cwd);
      return rootDir;
    } catch (error) {
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
    await getRootPackageName({ rootDirectory });
  } catch (error) {
    command.error(
      chalk.red.bold('No valid root package detected') +
        '\n You must have a package.json file within the same directory as your lockfile. Your package.json file must also have a name property.',
      { exitCode: 1 },
    );
  }

  try {
    await getPackages({ rootDirectory });
  } catch (error: any) {
    command.error(chalk.red(error?.message), { exitCode: 1 });
  }
};
