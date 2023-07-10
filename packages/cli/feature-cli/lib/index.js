#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const commander_1 = require('commander');
const publish_1 = require('./commands/publish');
const init_1 = require('./commands/init');
const validate_1 = require('./commands/validate');
const open_1 = require('./commands/open');
const program = new commander_1.Command();
program
  .name('commonality')
  .description('Infinitely scale your front-end ecosystem')
  .version('1.0.0');
program.addCommand(init_1.init);
program.addCommand(publish_1.publish);
program.addCommand(validate_1.validate);
program.addCommand(open_1.open);
program.parse();
