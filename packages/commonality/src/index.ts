import { Command } from 'commander';
import { publish } from './commands/publish';
import { init } from './commands/init';
import { validate } from './commands/validate';
import { open } from './commands/open';

const program = new Command();

program
  .name('commonality')
  .description('Infinitely scale your front-end ecosystem');

program.addCommand(init);
program.addCommand(publish);
program.addCommand(validate);
program.addCommand(open);

program.parse(process.argv);
