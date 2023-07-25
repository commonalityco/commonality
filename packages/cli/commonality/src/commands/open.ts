import { Command } from 'commander';
import { start } from '@commonalityco/studio';
import getPort from 'get-port';
import openUrl from 'open';
import { validateProjectStructure } from '../utils/validate-project-structure';
import { getRootDirectory } from '@commonalityco/data-project';
import boxen from 'boxen';
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
      start({ port, rootDirectory });
      console.log(`Starting Commonality Studio...`);
      console.log(`Viewable at: ${chalk.dim(url)}`);

      await openUrl(url);
    } catch (error) {
      console.log(error);
    }
  });
