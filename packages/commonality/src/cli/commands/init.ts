import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

export const init = program
  .name('init')
  .description('Create a new project in Commonality')
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile.",
  )
  .action(async () => {
    console.log(chalk.bold.blue('\nWelcome to Commonality'));
    console.log('Here is what we will will do:');
    console.log('1. Create a new project within Commonality');
    console.log('2. Create configuration files');
    console.log('3. Open the Commonality Dashboard');
  });
