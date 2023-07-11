import { Command } from 'commander';
import { start } from '@commonalityco/app-dashboard';
import getPort from 'get-port';
import openUrl from 'open';
import { validateProjectStructure } from '../utils/validate-project-structure';
import { getRootDirectory } from '@commonalityco/data-project';

const command = new Command();

export const open = command
  .name('open')
  .description('Open the Commonality Dashboard')
  .action(async () => {
    await validateProjectStructure({
      directory: process.cwd(),
      command,
    });

    const port = await getPort({ port: 8888 });
    const rootDirectory = await getRootDirectory();

    try {
      start({ port, rootDirectory });

      await openUrl(`http://localhost:${port}`);
    } catch (error) {
      console.log(error);
    }
  });
