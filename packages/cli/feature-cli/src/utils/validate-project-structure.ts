import { getRootPackage, getPackages } from '@commonalityco/data-packages';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import { Command } from 'commander';

const getMessage = (errorMessage: string) =>
  `
${chalk.red(errorMessage)}
Commonality can only be run in projects where:
1. A lockfile created by npm, yarn, or pnpm is at the root of the project
2. A package.json is at the root of the project
3. Every package.json file has a unique "name" property
`.trim();

export const validateProjectStructure = async ({
  directory,
  command,
}: {
  directory: string;
  command: Command;
}) => {
  try {
    await getRootDirectory(directory);
  } catch (error) {
    command.error(getMessage('No lockfile detected'), { exitCode: 1 });
  }

  try {
    await getRootPackage({ rootDirectory: directory });
  } catch (error) {
    command.error(getMessage('No root package detected'), { exitCode: 1 });
  }

  try {
    await getPackages({ rootDirectory: directory });
  } catch (error: unknown) {
    command.error(getMessage(error.message), { exitCode: 1 });
  }
};
