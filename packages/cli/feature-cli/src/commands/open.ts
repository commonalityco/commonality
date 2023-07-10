import { Command } from 'commander';
import { start } from '@commonalityco/app-dashboard';
import getPort from 'get-port';
import openUrl, { apps } from 'open';

const program = new Command();

export const open = program
  .name('open')
  .description('Open the Commonality Dashboard')
  .action(async () => {
    const port = await getPort({ port: 8888 });

    try {
      await start(port);

      await openUrl(`http://localhost:${port}`);
    } catch (error) {
      console.log(error);
    }
  });
