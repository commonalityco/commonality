import { Command } from 'commander';
import { start } from '@commonalityco/studio';
import getPort from 'get-port';
import openUrl from 'open';
import { validateProjectStructure } from '../utils/validate-project-structure.js';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import waitOn from 'wait-on';

const command = new Command();

export const open = command
  .name('open')
  .description('Open Commonality Studio')
  .action(async () => {
    await validateProjectStructure({
      directory: process.cwd(),
      command,
    });

    const port = await getPort({ port: 8888 });
    const rootDirectory = await getRootDirectory();
    const url = `http://127.0.0.1:${port}`;

    try {
      console.log(`📦 Starting Commonality Studio...\n`);

      start({ port, rootDirectory, env: 'production' });

      await waitOn({ resources: [url] });

      console.log(
        `Viewable at: ${chalk.blue.bold(url)} ${chalk.dim(
          '(press ctrl-c to quit)',
        )}`,
      );

      await openUrl(url);
    } catch {
      console.log(chalk.red('Unable to start Commonality Studio'));
    }
  });
