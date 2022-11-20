import { Command } from 'commander';
import chalk from 'chalk';
import { config } from '../core/config';

const program = new Command();

export const logout = program
  .name('logout')
  .description('Create and upload a snapshot of your monorepo')
  .action(async () => {
    config.clear();
    console.log(chalk.green('✔ Successfully logged out'));
  });
