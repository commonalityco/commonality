#!/usr/bin/env node
import { Command } from 'commander';
import { publish } from './commands/publish';
import { init } from './commands/init';
import { validate } from './commands/validate';
import { open } from './commands/open';
import updateNotifier from 'update-notifier';
import { readJsonSync } from 'fs-extra';
import path from 'path';

updateNotifier({
  pkg: readJsonSync(path.resolve(__dirname, '../package.json')),
}).notify();

const program = new Command();

program
  .name('commonality')
  .description('Infinitely scale your front-end ecosystem')
  .version('1.0.0');

program.addCommand(init);
program.addCommand(publish);
program.addCommand(validate);
program.addCommand(open);

program.parse(process.argv);
