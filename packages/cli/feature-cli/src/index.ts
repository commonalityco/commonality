#!/usr/bin/env node
import { Command } from 'commander';
import { publish } from './commands/publish';
import { init } from './commands/init';
import { validate } from './commands/validate';
import { open } from './commands/open';

const program = new Command();

program
  .name('commonality')
  .description('A toolchain for your monorepo')
  .version('1.0.0');

program.addCommand(init);
program.addCommand(publish);
program.addCommand(validate);
program.addCommand(open);

program.parse();
