import { Command } from 'commander';
import { publish } from './commands/publish.js';
import { init } from './commands/init.js';
import { validate } from './commands/validate.js';
import { open } from './commands/open.js';
import { link } from './commands/link.js';
import packageJson from '../package.json';

const program = new Command();

program
  .name('commonality')
  .description('Infinitely scalable front-end ecosystems')
  .version(packageJson.version);

program.addCommand(init);
program.addCommand(publish);
program.addCommand(validate);
program.addCommand(open);
program.addCommand(link);

program.parse(process.argv);
