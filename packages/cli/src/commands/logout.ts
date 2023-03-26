import { Command } from 'commander';
import { store } from '../core/store';
import chalk from 'chalk';
const program = new Command();

export const logout = program
  .name('logout')
  .description('Create and upload a snapshot of your monorepo')
  .action(async () => {
    store.clear();
    console.log(chalk.green('✔ Successfully logged out'));
  });
