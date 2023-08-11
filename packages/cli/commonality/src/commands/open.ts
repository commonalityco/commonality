import { Command } from 'commander';
import { start } from '@commonalityco/studio';
import getPort from 'get-port';
import openUrl from 'open';
import { validateProjectStructure } from '../utils/validate-project-structure';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';

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
    const url = `http://localhost:${port}`;
    try {
      start({ port, rootDirectory, env: 'production' });

      console.log(`📦 Starting Commonality Studio...\n`);
      console.log(
        `Viewable at: ${chalk.blue.bold(url)} ${chalk.dim(
          '(press ctrl-c to quit)'
        )}`
      );

      await openUrl(url);
    } catch (error) {
      console.log(error);
    }
  });
