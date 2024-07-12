import { Command } from 'commander';
import { publish } from './commands/publish.js';
import packageJson from '../../package.json';

const program = new Command();

program
  .option('--color', 'Force the use of color in output')
  .option('--no-color', 'Suppress the use of color in output');

program
  .name('commonality')
  .description('Build bigger with the tools you already love')
  .version(packageJson.version);

program.addCommand(publish);
program.parse(process.argv);
