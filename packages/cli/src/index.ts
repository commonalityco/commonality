#!/usr/bin/env node
import { Command } from 'commander';
import { publish } from './commands/publish';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { link } from './commands/link';
import { validate } from './commands/validate';

const program = new Command();

program
  .name('commonality')
  .description('A toolchain for your monorepo')
  .version('1.0.0');

program.addCommand(publish);
program.addCommand(link);
program.addCommand(login);
program.addCommand(logout);
program.addCommand(validate);

program.parse();
