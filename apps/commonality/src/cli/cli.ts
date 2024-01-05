import { Command } from 'commander';
import { constrain } from './commands/constrain.js';
import { studio } from './commands/studio.js';
import { check } from './commands/check.js';
import packageJson from '../../package.json';

const program = new Command();

program
  .option('--color', 'Force the use of color in output')
  .option('--no-color', 'Suppress the use of color in output');

program
  .name('commonality')
  .description('Build bigger with the tools you already love.')
  .version(packageJson.version);

program.addCommand(check);
program.addCommand(constrain);
program.addCommand(studio);

program.parse(process.argv);
