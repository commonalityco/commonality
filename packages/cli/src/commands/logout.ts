import { Command } from 'commander';
import { store } from '../core/store.js';

const program = new Command();

export const logout = program
  .name('logout')
  .description('Create and upload a snapshot of your monorepo')
  .action(async () => {
    const { default: chalk } = await import('chalk');

    store.clear();
    console.log(chalk.green('✔ Successfully logged out'));
  });
