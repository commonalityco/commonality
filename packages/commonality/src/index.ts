import { Command } from 'commander';
import { publish } from './commands/publish';
import { init } from './commands/init';
import { validate } from './commands/validate';
import { open } from './commands/open';
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
