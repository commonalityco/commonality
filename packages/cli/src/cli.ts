#!/usr/bin/env node
import { Command } from 'commander';
import { publish } from './commands/publish.js';
import { login } from './commands/login.js';
import { logout } from './commands/logout.js';
import { link } from './commands/link.js';
import { init } from './commands/init.js';
import { validate } from './commands/validate.js';

const program = new Command();

program
  .name('commonality')
  .description('A toolchain for your monorepo')
  .version('1.0.0');

program.addCommand(init);
program.addCommand(publish);
program.addCommand(link);
program.addCommand(login);
program.addCommand(logout);
program.addCommand(validate);

program.parse();
