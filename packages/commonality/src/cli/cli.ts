import { Command } from 'commander';
import { init } from './commands/init.js';
import { constrain } from './commands/constrain.js';
import { studio } from './commands/studio.js';
import { conform } from './commands/conform.js';
import packageJson from '../../package.json';

const program = new Command();

program
  .name('commonality')
  .description('Infinitely scalable front-end ecosystems')
  .version(packageJson.version);

program.addCommand(init);
program.addCommand(constrain);
program.addCommand(studio);
program.addCommand(conform);

program.parse(process.argv);
