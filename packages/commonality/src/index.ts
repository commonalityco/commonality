import { Command } from 'commander';
import { publish } from './commands/publish.js';
import { init } from './commands/init.js';
import { validate } from './commands/validate.js';
import { open } from './commands/open.js';
import updateNotifier from 'update-notifier';
import packageJson from '../package.json';

updateNotifier({ pkg: packageJson }).notify();

const program = new Command();

program
  .name('commonality')
  .description('Infinitely scalable front-end ecosystems')
  .version(packageJson.version);

program.addCommand(init);
program.addCommand(publish);
program.addCommand(validate);
program.addCommand(open);

program.parse(process.argv);
