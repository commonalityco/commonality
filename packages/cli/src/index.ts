#!/usr/bin/env node
import { Command } from 'commander';
import { publish } from './commands/publish';
import { logout } from './commands/logout';
import { link } from './commands/link';
import { init } from './commands/init';
import { open } from './commands/open';
// import { validate } from './commands/validate.js';

const program = new Command();

program
  .name('commonality')
  .description('A toolchain for your monorepo')
  .version('1.0.0');

program.addCommand(init);
program.addCommand(publish);
program.addCommand(link);
program.addCommand(logout);
program.addCommand(open);
// program.addCommand(validate);

program.parse();
